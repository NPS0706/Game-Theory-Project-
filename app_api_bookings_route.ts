import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const sport = searchParams.get('sport')
  const date = searchParams.get('date')

  if (!city || !sport || !date) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()
    const bookings = await db.collection('bookings').find({
      city,
      sport,
      date: new Date(date),
    }).toArray()

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { city, sport, date, court, startTime } = await request.json()

    if (!city || !sport || !date || !court || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const bookingDate = new Date(date)
    const startDateTime = new Date(`${bookingDate.toISOString().split('T')[0]}T${startTime}:00`)
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hour later

    const { db } = await connectToDatabase()

    // Check for conflicting bookings
    const conflictingBooking = await db.collection('bookings').findOne({
      city,
      sport,
      court,
      date: bookingDate,
      $or: [
        { startTime: { $lt: endDateTime, $gte: startDateTime } },
        { endTime: { $lte: endDateTime, $gt: startDateTime } },
      ],
    })

    if (conflictingBooking) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
    }

    const result = await db.collection('bookings').insertOne({
      city,
      sport,
      date: bookingDate,
      court,
      startTime: startDateTime,
      endTime: endDateTime,
    })

    return NextResponse.json({ message: 'Booking created successfully', id: result.insertedId })
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}