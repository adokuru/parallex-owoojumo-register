import { NextResponse } from 'next/server';
import { ApiResponse, Bank } from '@/lib/types';

export async function GET() {
  try {
    // Replace with actual API call to your backend
    // const response = await fetch(`${process.env.BACKEND_URL}/banks`);
    // const data = await response.json();

    const apiResponse: ApiResponse<Bank[]> = {
      success: true,
      message: 'Banks fetched successfully',
      data: mockBanks,
    };

    return NextResponse.json(apiResponse);
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch banks',
        data: null,
      },
      { status: 500 }
    );
  }
}
