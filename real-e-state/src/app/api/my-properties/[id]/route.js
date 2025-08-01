export async function PUT(req, { params }) {
  try {
    await connectDB();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const property = await Property.findById(params.id);
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    if (property.postedBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (property.status === 'approved') {
      return NextResponse.json({ error: 'Cannot edit approved property' }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, location, price } = body;

    property.title = title;
    property.description = description;
    property.location = location;
    property.price = price;

    await property.save();

    return NextResponse.json({ message: 'Property updated' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
