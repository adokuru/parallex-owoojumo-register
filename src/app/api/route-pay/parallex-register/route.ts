import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, RegistrationFormData, RegistrationResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegistrationFormData;

    // Minimal server-side validation mirroring client
    if (!body.firstName || !body.surname || !body.phone || !body.nin || !body.bvn || !body.address) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', data: null },
        { status: 400 }
      );
    }

    if (!body.bank_id || !body.account_number || body.account_number.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid bank/account details', data: null },
        { status: 400 }
      );
    }

    // Replace this mock with a proxy to your backend
    // const response = await fetch(`${process.env.BACKEND_URL}/route-pay/parallex-register`, { ... })

    const mockResponse: RegistrationResponse = {
      authtoken: 'mock-token-123',
    };

    const apiResponse: ApiResponse<RegistrationResponse> = {
      success: true,
      message: 'Registration successful',
      data: mockResponse,
    };

    return NextResponse.json(apiResponse);
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Registration failed',
        data: null,
      },
      { status: 500 }
    );
  }
}
