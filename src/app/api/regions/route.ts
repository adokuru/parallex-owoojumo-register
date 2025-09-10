import { NextResponse } from 'next/server';
import { ApiResponse, Region } from '@/lib/types';

// This would connect to your actual backend/database
// For now, returning mock data similar to the React Native implementation
export async function GET() {
  try {
    // Replace with actual API call to your backend
    // const response = await fetch(`${process.env.BACKEND_URL}/regions`);
    // const data = await response.json();
    
    // Mock data for demonstration
    const mockRegions: Region[] = [
      { id: '1', name: 'Lagos' },
      { id: '2', name: 'Abuja' },
      { id: '3', name: 'Kano' },
      { id: '4', name: 'Rivers' },
    ];

    const apiResponse: ApiResponse<Region[]> = {
      success: true,
      message: 'Regions fetched successfully',
      data: mockRegions,
    };

    return NextResponse.json(apiResponse);
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch regions',
        data: null,
      },
      { status: 500 }
    );
  }
}
