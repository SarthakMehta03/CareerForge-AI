/**
 * Production First-Admin Bootstrap CLI Script
 *
 * Usage:
 *   node scripts/bootstrapAdmin.js <admin_email>
 *   npm run bootstrap-admin -- <admin_email>
 *
 * Examples:
 *   node scripts/bootstrapAdmin.js admin@careerforge.ai
 *   node scripts/bootstrapAdmin.js newadmin@example.com --name="Super Admin" --password="SecurePassword123!"
 *
 * This script runs strictly on the server-side CLI or deployment hook.
 * It NEVER exposes a public API route or client-side bypass.
 */

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

async function bootstrap() {
  const args = process.argv.slice(2);

  // Extract email from positional argument or --email= flag
  let email = "";
  let name = "Administrator";
  let password = "";

  args.forEach((arg) => {
    if (arg.startsWith("--email=")) {
      email = arg.split("=")[1].trim();
    } else if (arg.startsWith("--name=")) {
      name = arg.split("=")[1].trim();
    } else if (arg.startsWith("--password=")) {
      password = arg.split("=")[1].trim();
    } else if (!arg.startsWith("--") && !email) {
      email = arg.trim();
    }
  });

  // Fallback to environment variable if provided
  if (!email && process.env.FIRST_ADMIN_EMAIL) {
    email = process.env.FIRST_ADMIN_EMAIL.trim();
  }

  if (!email) {
    console.error("❌ Error: Target administrator email is required.");
    console.error("Usage: node scripts/bootstrapAdmin.js <email> [--name=\"Name\"] [--password=\"Password\"]");
    console.error("   or: set FIRST_ADMIN_EMAIL in your .env file.");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    await connectDB();
    console.log(" Connected to MongoDB Atlas.");

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const previousRole = user.role;
      user.role = "admin";
      user.status = "active";
      if (password) {
        if (password.length < 6) {
          console.error("❌ Password must be at least 6 characters long.");
          process.exit(1);
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        console.log(` Password updated successfully.`);
      }
      await user.save();

      console.log(` Existing user found: ${user.name} (${user.email})`);
      console.log(` Successfully promoted role from '${previousRole}' to 'admin'.`);
      console.log(` Account status is active.`);

      // Log bootstrap action
      await AuditLog.create({
        adminId: user._id,
        adminName: "System Bootstrap CLI",
        adminEmail: "cli-bootstrap@system.local",
        action: "FIRST_ADMIN_BOOTSTRAP",
        targetId: String(user._id),
        targetType: "User",
        metadata: {
          email: user.email,
          previousRole,
          newRole: "admin",
          method: "CLI_PROMOTION",
        },
        outcome: "SUCCESS",
      });
    } else {
      if (!password) {
        console.error(`❌ User with email '${normalizedEmail}' does not exist.`);
        console.error("To create a new admin account directly, provide a password:");
        console.error(`node scripts/bootstrapAdmin.js ${normalizedEmail} --password="YourSecurePassword" --name="Admin Name"`);
        process.exit(1);
      }

      if (password.length < 6) {
        console.error("❌ Password must be at least 6 characters long.");
        process.exit(1);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name: name || "Administrator",
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin",
        status: "active",
      });

      await user.save();
      console.log(` Created new administrator account: ${user.name} (${user.email})`);

      await AuditLog.create({
        adminId: user._id,
        adminName: "System Bootstrap CLI",
        adminEmail: "cli-bootstrap@system.local",
        action: "FIRST_ADMIN_BOOTSTRAP",
        targetId: String(user._id),
        targetType: "User",
        metadata: {
          email: user.email,
          newRole: "admin",
          method: "CLI_CREATION",
        },
        outcome: "SUCCESS",
      });
    }

    console.log(" First-admin bootstrap completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ First-admin bootstrap failed:", error.message);
    process.exit(1);
  }
}

bootstrap();
