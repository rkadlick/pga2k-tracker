import { NextRequest, NextResponse } from "next/server";
import { addHoleResults, updateHoleResults } from "@/lib/matchService";
import { validateHoleResults } from "@/lib/validation/matchValidation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const payload = await request.json();

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
  

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();

    // Validate hole results
    const validationErrors = validateHoleResults(payload);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    const updatedHoleResults = await updateHoleResults(id, payload.holeResults);
    return NextResponse.json({ data: updatedHoleResults });
  } catch (error) {
    console.error("Error updating hole results:", error);
    return NextResponse.json(
      { error: "Failed to update hole results" },
      { status: 500 }
    );
  }
}

