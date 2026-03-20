import jsPDF from "jspdf";
import type { StudentDocument } from "@/types/student";
import type { ResultDocument } from "@/types/result";

function getGrade(marks: number): string {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "F";
}

async function convertImageUrlToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      return null;
    }

    const imageBlob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to convert image blob"));
      reader.readAsDataURL(imageBlob);
    });

    return dataUrl;
  } catch {
    return null;
  }
}

function getImageFormatFromDataUrl(dataUrl: string): "PNG" | "JPEG" {
  return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
}

function drawSectionHeader(
  pdf: jsPDF,
  title: string,
  yPosition: number,
): number {
  pdf.setFontSize(14);
  pdf.setTextColor(47, 10, 94);
  pdf.setFont("Helvetica", "bold");
  pdf.text(title, 15, yPosition);

  pdf.setDrawColor(246, 177, 0);
  pdf.setLineWidth(0.5);
  pdf.line(15, yPosition + 3, 195, yPosition + 3);

  return yPosition + 10;
}

async function drawStudentIdCard(
  pdf: jsPDF,
  student: StudentDocument,
  startY: number,
): Promise<number> {
  const cardX = 10;
  const cardY = startY;
  const cardWidth = 190;
  const cardHeight = 52;

  pdf.setDrawColor(232, 224, 245);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 4, 4, "FD");

  pdf.setFillColor(47, 10, 94);
  pdf.roundedRect(cardX, cardY, cardWidth, 1.7, 1.2, 1.2, "F");

  const contentTop = cardY + 8;

  const photoX = cardX + 6;
  const photoY = contentTop;
  const photoW = 24;
  const photoH = 28;

  pdf.setDrawColor(246, 177, 0);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(photoX, photoY, photoW, photoH, 2, 2, "S");

  const photoDataUrl = await convertImageUrlToDataUrl(student.photoUrl);
  if (photoDataUrl) {
    try {
      pdf.addImage(
        photoDataUrl,
        getImageFormatFromDataUrl(photoDataUrl),
        photoX + 0.6,
        photoY + 0.6,
        photoW - 1.2,
        photoH - 1.2,
      );
    } catch {
      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text("No", photoX + 9, photoY + 13);
      pdf.text("Photo", photoX + 6.8, photoY + 17);
    }
  } else {
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text("No", photoX + 9, photoY + 13);
    pdf.text("Photo", photoX + 6.8, photoY + 17);
  }

  const dividerX = photoX + photoW + 6;
  pdf.setDrawColor(240, 234, 248);
  pdf.setLineWidth(0.35);
  pdf.line(dividerX, contentTop, dividerX, contentTop + 28);

  const infoX = dividerX + 7;

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(246, 177, 0);
  pdf.text("FULL NAME", infoX, contentTop + 4);

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(47, 10, 94);
  const trimmedName = student.name.length > 24
    ? `${student.name.slice(0, 23)}…`
    : student.name;
  pdf.text(trimmedName, infoX, contentTop + 12);

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(156, 163, 175);
  pdf.text("ROLL NUMBER", infoX, contentTop + 20);
  pdf.text("COURSE", infoX + 70, contentTop + 20);

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(10.5);
  pdf.setTextColor(47, 10, 94);
  pdf.text(String(student.rollNo), infoX, contentTop + 27);

  const trimmedCourse = student.course.length > 18
    ? `${student.course.slice(0, 17)}…`
    : student.course;
  pdf.text(trimmedCourse, infoX + 70, contentTop + 27);

  const badgeWidth = 13;
  const badgeHeight = 8;
  const badgeX = cardX + cardWidth - badgeWidth - 6;
  const badgeY = contentTop + 10;

  pdf.setFillColor(47, 10, 94);
  pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 3, 3, "F");
  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(246, 177, 0);
  pdf.text("SSU", badgeX + 3, badgeY + 5.3);

  return cardY + cardHeight;
}

export async function generateStudentCardPDF(
  student: StudentDocument,
  _cardElement: HTMLElement | null,
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();

    let yPosition = 15;
    yPosition = drawSectionHeader(pdf, "Student Exam Result", yPosition);
    yPosition = await drawStudentIdCard(pdf, student, yPosition);

    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `Generated from Student Portal on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" },
    );

    pdf.save(`${student.rollNo}-student-card.pdf`);
  } catch (error) {
    console.error("Error generating student card PDF:", error);
  }
}

export async function generateStudentCardWithResultsPDF(
  student: StudentDocument,
  result: ResultDocument | null,
  _cardElement: HTMLElement | null,
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 15;
    yPosition = drawSectionHeader(pdf, "Student Exam Result", yPosition);
    yPosition = await drawStudentIdCard(pdf, student, yPosition);

    if (result) {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 15;
      }

      yPosition += 16;
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${result.heading || "Semester Results"}`, 15, yPosition);

      yPosition += 10;

      const totalMarks = result.subjects.reduce(
        (sum, subject) => sum + subject.marks,
        0,
      );
      const averageMarks =
        result.subjects.length > 0
          ? (totalMarks / result.subjects.length).toFixed(2)
          : "0.00";
      const isPassed = result.subjects.every((subject) => subject.marks >= 40);

      pdf.setFillColor(47, 10, 94);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(10);

      const colWidth = (pageWidth - 30) / 3;

      pdf.rect(15, yPosition - 5, pageWidth - 30, 8, "F");
      pdf.text("Subject", 18, yPosition);
      pdf.text("Marks", 18 + colWidth, yPosition);
      pdf.text("Grade", 18 + colWidth * 2, yPosition);

      yPosition += 10;

      pdf.setTextColor(50, 50, 50);
      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(9);

      result.subjects.forEach((subject) => {
        if (yPosition > pageHeight - 25) {
          pdf.addPage();
          yPosition = 15;

          pdf.setFillColor(47, 10, 94);
          pdf.setTextColor(255, 255, 255);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(10);
          pdf.rect(15, yPosition - 5, pageWidth - 30, 8, "F");
          pdf.text("Subject", 18, yPosition);
          pdf.text("Marks", 18 + colWidth, yPosition);
          pdf.text("Grade", 18 + colWidth * 2, yPosition);

          yPosition += 10;
          pdf.setTextColor(50, 50, 50);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(9);
        }

        const truncatedSubject = subject.name.length > 30
          ? `${subject.name.slice(0, 29)}…`
          : subject.name;
        pdf.text(truncatedSubject, 18, yPosition);
        pdf.text(String(subject.marks), 18 + colWidth, yPosition);
        pdf.text(getGrade(subject.marks), 18 + colWidth * 2, yPosition);
        yPosition += 7;
      });

      yPosition += 8;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);

      yPosition += 10;
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(47, 10, 94);

      pdf.text(`Total Marks: ${totalMarks}`, 15, yPosition);
      yPosition += 8;
      pdf.text(`Average: ${averageMarks}`, 15, yPosition);

      yPosition += 12;
      pdf.setFontSize(12);
      pdf.setTextColor(
        isPassed ? 22 : 220,
        isPassed ? 163 : 38,
        isPassed ? 74 : 38,
      );
      pdf.text(`Result: ${isPassed ? "PASS" : "FAIL"}`, 15, yPosition);
    }

    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    const footerText = `Generated on ${new Date().toLocaleDateString()}`;
    pdf.text(footerText, pageWidth / 2, footerY, { align: "center" });

    pdf.save(`${student.rollNo}-student-card-results.pdf`);
  } catch (error) {
    console.error("Error generating student card with results PDF:", error);
  }
}



