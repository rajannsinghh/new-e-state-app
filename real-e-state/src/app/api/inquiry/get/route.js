import { connectDB } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const property = searchParams.get('property');

    const query = {};

    if (from && to) {
      query.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (property) {
      query.propertyName = { $regex: property, $options: 'i' }; // partial match, case-insensitive
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    return Response.json({ success: true, inquiries });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
