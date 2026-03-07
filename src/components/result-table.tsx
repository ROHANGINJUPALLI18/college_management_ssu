"use client";

import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import type { ResultDocument } from "@/types/result";

type ResultTableProps = {
  result: ResultDocument;
};

export function ResultTable({ result }: ResultTableProps) {
  const totalMarks = result.subjects.reduce(
    (sum, subject) => sum + subject.marks,
    0,
  );
  const averageMarks = result.subjects.length
    ? (totalMarks / result.subjects.length).toFixed(2)
    : "0.00";

  function downloadResultAsPortableDocumentFormat(): void {
    const pdfDocument = new jsPDF();
    pdfDocument.setFontSize(16);
    pdfDocument.text("Student Result", 14, 18);
    pdfDocument.setFontSize(11);
    pdfDocument.text(`Roll Number: ${result.rollNo}`, 14, 28);

    let currentYPosition = 40;
    pdfDocument.text("Subject", 14, currentYPosition);
    pdfDocument.text("Marks", 130, currentYPosition);

    result.subjects.forEach((subject) => {
      currentYPosition += 10;
      pdfDocument.text(subject.name, 14, currentYPosition);
      pdfDocument.text(String(subject.marks), 130, currentYPosition);
    });

    currentYPosition += 16;
    pdfDocument.text(`Total Marks: ${totalMarks}`, 14, currentYPosition);
    currentYPosition += 8;
    pdfDocument.text(`Average: ${averageMarks}`, 14, currentYPosition);

    pdfDocument.save(`${result.rollNo}-result.pdf`);
  }

  return (
    <Card>
      <CardTitle className="mb-4">Result Details</CardTitle>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <TableHead>Subject</TableHead>
              <TableHead>Marks</TableHead>
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((subject) => (
              <tr key={subject.name}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.marks}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="mt-4 space-y-1 text-sm text-[#3f3252]">
        <p>Total Marks: {totalMarks}</p>
        <p>Average: {averageMarks}</p>
      </div>
      <Button
        className="mt-4"
        variant="accent"
        onClick={downloadResultAsPortableDocumentFormat}
      >
        Download Result
      </Button>
    </Card>
  );
}
