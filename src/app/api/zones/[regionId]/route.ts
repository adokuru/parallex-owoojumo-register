import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Zone } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { regionId: string } }
) {
  try {
    const regionId = params.regionId;

    // Replace with actual API call to your backend
    // const response = await fetch(`${process.env.BACKEND_URL}/zones/region/${regionId}`);
    // const data = await response.json();
    
    // Mock data for demonstration
    const mockZonesByRegion: Record<string, Zone[]> = {
      '1': [
        { id: '1', name: 'Lagos Island' },
        { id: '2', name: 'Lagos Mainland' },
        { id: '3', name: 'Ikeja' },
      ],
      '2': [
        { id: '4', name: 'Garki' },
        { id: '5', name: 'Wuse' },
        { id: '6', name: 'Maitama' },
      ],
      '3': [
        { id: '7', name: 'Kano Municipal' },
        { id: '8', name: 'Fagge' },
      ],
      '4': [
        { id: '9', name: 'Port Harcourt' },
        { id: '10', name: 'Obio-Akpor' },
      ],
    };

    const zones = mockZonesByRegion[regionId] || [];

    const apiResponse: ApiResponse<Zone[]> = {
      success: true,
      message: 'Zones fetched successfully',
      data: zones,
    };

    return NextResponse.json(apiResponse);
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch zones',
        data: null,
      },
      { status: 500 }
    );
  }
}
