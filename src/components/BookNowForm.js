import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookNowForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    vehicle: "",
    issue: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : "";
    const formattedTime = selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

    const payload = {
      data: {
        ...form,
        date: formattedDate,
        time: formattedTime,
      },
    };

    try {
      const res = await fetch("https://sheetdb.io/api/v1/auvap76vv6re6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", city: "", vehicle: "", issue: "" });
        setSelectedDate(null);
        setSelectedTime(null);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white text-black rounded-2xl shadow-2xl relative">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-tight">
        Book Your Service
      </h2>

      {status === "success" && (
        <div className="mb-6 text-green-700 bg-green-100 border border-green-300 rounded-lg p-4 text-sm text-center font-medium">
          ✅ Your request has been shared. We’ll call you shortly.
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 text-red-700 bg-red-100 border border-red-300 rounded-lg p-4 text-sm text-center font-medium">
          ❌ Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Phone Number</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="bg-gray-100 text-gray-600 px-3 py-2 text-sm flex items-center">+91</span>
            <input
              name="phone"
              type="tel"
              placeholder="1234567890"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm outline-none"
              required
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">City</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select City</option>
            <option value="Bhopal">Bhopal</option>
          </select>
        </div>

        {/* Vehicle */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Vehicle Type</label>
          <select
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Vehicle</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
            <option value="Auto">Auto</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        {/* Issue */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Issue</label>
          <select
            name="issue"
            value={form.issue}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Issue</option>
            <option value="General Service">General Service</option>
            <option value="Car Washing">Car Washing</option>
            <option value="Electrical Work">Electrical Work</option>
            <option value="Free Check Up">Free Check Up</option>
            <option value="Accident Repair">Accident Repair</option>
            <option value="Tyre & Brake Issue">Tyre & Brake Issue</option>
            <option value="Battery Problem">Battery Problem</option>
            <option value="Engine Diagnostics">Engine Diagnostics</option>
            <option value="Other">Other</option>
          </select>
        </div>

       <div className="flex flex-col sm:flex-row gap-4">
  {/* Preferred Date */}
  <div className="w-full sm:w-1/2">
    <label className="block mb-1 text-sm font-semibold text-gray-700">Preferred Date</label>
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      minDate={new Date()}
      placeholderText="Select a date"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Preferred Time */}
  <div className="w-full sm:w-1/2">
  <label className="block mb-1 text-sm font-semibold text-gray-700">Preferred Time</label>
  <select
    name="time"
    value={form.time}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
    disabled={status === "submitting"}
  >
    <option value="">Select Time Slot</option>
    <option value="09:00 AM – 10:00 AM">09:00 AM – 10:00 AM</option>
    <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
    <option value="11:00 AM – 12:00 PM">11:00 AM – 12:00 PM</option>
    <option value="12:00 PM – 01:00 PM">12:00 PM – 01:00 PM</option>
    <option value="01:00 PM – 02:00 PM">01:00 PM – 02:00 PM</option>
    <option value="02:00 PM – 03:00 PM">02:00 PM – 03:00 PM</option>
    <option value="03:00 PM – 04:00 PM">03:00 PM – 04:00 PM</option>
    <option value="04:00 PM – 05:00 PM">04:00 PM – 05:00 PM</option>
    <option value="05:00 PM – 06:00 PM">05:00 PM – 06:00 PM</option>
  </select>
</div>
</div>


        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-black text-white text-sm font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
