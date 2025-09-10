import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, AccountValidationResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bank_code, account_number } = body;

    if (!bank_code || !account_number) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bank code and account number are required',
          data: null,
        },
        { status: 400 }
      );
    }

    if (account_number.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account number must be 10 digits',
          data: null,
        },
        { status: 400 }
      );
    }

    // Replace with actual API call to your banking validation service
    // const response = await fetch(`${process.env.BACKEND_URL}/validate-account`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ bank_code, account_number }),
    // });
    // const data = await response.json();
    
    // Mock validation for demonstration
    // In real implementation, this would validate against actual banking APIs
    const mockAccountNames: Record<string, string> = {
      '0123456789': 'John Doe',
      '9876543210': 'Jane Smith',
      '1111111111': 'Test User',
    };

    const accountName = mockAccountNames[account_number] || 'Account Holder Name';

    const apiResponse: ApiResponse<AccountValidationResponse> = {
      success: true,
      message: 'Account validated successfully',
      data: { account_name: accountName },
    };

    return NextResponse.json(apiResponse);
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to validate account',
        data: null,
      },
      { status: 500 }
    );
  }
}
