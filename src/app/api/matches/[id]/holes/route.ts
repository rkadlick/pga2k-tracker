import { NextRequest, NextResponse } from "next/server";
import { addHoleResults } from "@/lib/matchService";
import { validateHoleResults } from "@/lib/validation/matchValidation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const payload = await request.json();
    console.log("holeResults", payload);

    // Validate hole results
    const validationErrors = validateHoleResults(payload);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    const updatedHoleResults = await addHoleResults(id, payload.holeResults);
    return NextResponse.json({ data: updatedHoleResults });
  } catch (error) {
    console.error("Error adding hole results:", error);
    return NextResponse.json(
      { error: "Failed to add hole results" },
      { status: 500 }
    );
  }
}
