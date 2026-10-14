import toast from "react-hot-toast";

/**
 * Exports the resume preview as a crisp vector PDF using browser native print-to-PDF.
 * This completely avoids the UI freeze caused by html2canvas rasterization,
 * ensures 100% vector text quality (searchable & ATS-parseable),
 * and dynamically names the PDF using the candidate's name or resume title.
 *
 * @param {string} elementId - ID of preview container (defaults to 'resume-preview-content')
 * @param {object} resume - Resume state object containing personalInfo and title
 */
export async function downloadResumePDF(elementId = "resume-preview-content", resume = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error("Could not find resume preview to download");
    return false;
  }

  // 1. Determine a clean, professional file name (NEVER defaults to 'client')
  const fullName = resume?.personalInfo?.fullName?.trim();
  const resumeTitle = resume?.title?.trim();

  let baseName = "Resume";
  if (fullName && fullName.toLowerCase() !== "your name") {
    baseName = `${fullName}_Resume`;
  } else if (
    resumeTitle &&
    resumeTitle.toLowerCase() !== "resume 1" &&
    resumeTitle.toLowerCase() !== "my resume" &&
    resumeTitle.toLowerCase() !== "untitled"
  ) {
    baseName = `${resumeTitle}_Resume`;
  } else if (fullName) {
    baseName = `${fullName}_Resume`;
  } else {
    baseName = "CareerForge_Resume";
  }

  // Sanitize: replace spaces with underscores, strip illegal filesystem characters
  const cleanFilename = baseName
    .replace(/[<>:"/\\|?*]+/g, "")
    .trim()
    .replace(/\s+/g, "_");

  // 2. Temporarily set document.title so browser's Save-as-PDF dialog defaults to this name
  const originalTitle = document.title;
  document.title = cleanFilename;

  toast.success(`Preparing ${cleanFilename}.pdf... Select 'Save as PDF'`, {
    duration: 3500,
    icon: "📄",
  });

  // 3. Defer slightly with setTimeout so the UI thread repaints (no freeze)
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        window.print();
        resolve(true);
      } catch (err) {
        console.error("Print export error:", err);
        toast.error("Failed to open print dialog");
        resolve(false);
      } finally {
        // 4. Restore original document title after dialog
        setTimeout(() => {
          document.title = originalTitle;
        }, 1200);
      }
    }, 120);
  });
}
