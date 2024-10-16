'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const cities = [
  "Bengaluru (Indiranagar)", "Bengaluru (Koramangala)", "Mumbai", "Delhi", "Chennai",
  "Hyderabad", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Kochi", "Chandigarh", "Lucknow", "Noida"
]

const sports = ["Badminton", "Squash", "Tennis", "Football", "Cricket", "Basketball"]

export default function SportsBookingSystem() {
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [bookings, setBookings] = useState([])
  const [newBooking, setNewBooking] = useState({ court: '', startTime: '' })

  const fetchBookings = async () => {
    if (!selectedCity || !selectedSport || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select city, sport, and date",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/bookings?city=${selectedCity}&sport=${selectedSport}&date=${selectedDate.toISOString()}`)
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    }
  }

  const createBooking = async () => {
    if (!selectedCity || !selectedSport || !selectedDate || !newBooking.court || !newBooking.startTime) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          sport: selectedSport,
          date: selectedDate.toISOString(),
          court: newBooking.court,
          startTime: newBooking.startTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      toast({
        title: "Success",
        description: "Booking created successfully",
      })

      setNewBooking({ court: '', startTime: '' })
      fetchBookings()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sports Booking System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Filters</CardTitle>
            <CardDescription>Select city, sport, and date to view bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select onValueChange={setSelectedCity}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <Select onValueChange={setSelectedSport}>
                <SelectTrigger id="sport">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchBookings}>View Bookings</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Create Booking</CardTitle>
            <CardDescription>Fill in the details to create a new booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="court">Court</Label>
              <Input
                id="court"
                value={newBooking.court}
                onChange={(e) => setNewBooking({ ...newBooking, court: e.target.value })}
                placeholder="Enter court name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newBooking.startTime}
                onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={createBooking}>Create Booking</Button>
          </CardFooter>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Current bookings for selected filters</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Court</th>
                    <th className="px-4 py-2 text-left">Start Time</th>
                    <th className="px-4 py-2 text-left">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{booking.court}</td>
                      <td className="px-4 py-2">{format(new Date(booking.startTime), 'HH:mm')}</td>
                      <td className="px-4 py-2">{format(new Date(booking.endTime), 'HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No bookings found for the selected filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}