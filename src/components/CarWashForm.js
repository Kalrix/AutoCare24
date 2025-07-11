import React, { useState, useEffect, useMemo } from "react";
import { FiCheckCircle, FiArrowLeft, FiDroplet, FiSun } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const washTypes = [
  { name: "Foam Wash", price: 299, icon: <FiDroplet size={20} /> },
  { name: "Underbody Clean", price: 399, icon: <FaCarSide size={20} /> },
  { name: "Interior Detailing", price: 499, icon: <FiSun size={20} /> },
];

const allTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

function isSlotFuture(date, slot) {
  const now = new Date();
  const [hourStr, modifier] = slot.split(" ");
  let [hour, minute] = hourStr.split(":" ).map(Number);
  if (modifier === "PM" && hour !== 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;
  const slotDateTime = new Date(date);
  slotDateTime.setHours(hour, minute, 0, 0);
  return slotDateTime > now;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getNext7Days() {
  const now = new Date();
  const days = [];
  let added = 0;
  let i = 0;

  while (added < 7) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const isToday = i === 0;
    const isAfter5PM = now.getHours() >= 17;

    if (isToday && isAfter5PM) {
      i++; // skip today
      continue;
    }

    days.push(d);
    i++;
    added++;
  }

  return days;
}


export default function CarWashForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", express: false, washType: "" });
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("idle");
  const [bookedSlots, setBookedSlots] = useState({});

  const selectedWash = washTypes.find(w => w.name === form.washType);
  const total = useMemo(() => (selectedWash ? selectedWash.price : 0) + (form.express ? 199 : 0), [form, selectedWash]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("time")
          .eq("date", formatDate(selectedDate));

        if (error) throw error;

        const slots = data.reduce((acc, entry) => {
          acc[entry.time] = (acc[entry.time] || 0) + 1;
          return acc;
        }, {});

        setBookedSlots(slots);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const isNextDisabled = () => {
    if (step === 1) return !selectedTime;
    if (step === 2) return !form.washType;
    if (step === 3) return !form.name || form.phone.length !== 10;
    return false;
  };

  const handleSubmit = async () => {
    setStatus("submitting");
    const payload = {
  name: form.name,
  phone: form.phone,
  express: form.express,
  washtype: form.washType, // ✅ fix this key
  date: formatDate(selectedDate),
  time: selectedTime,
  price: total,
};


    try {
      const { error } = await supabase.from("bookings").insert([payload]);
      if (error) throw error;

      setStatus("success");
      setStep(5);
    } catch (err) {
      console.error("Booking insert failed:", err);
      setStatus("error");
      setStep(5);
    }
  };

  const reset = () => {
    setStep(1);
    setStatus("idle");
    setForm({ name: "", phone: "", express: false, washType: "" });
    setSelectedDate(getNext7Days()[0]);
    setSelectedTime("");
  };

  const StepTitle = ({ title }) => <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">{title}</h3>;
  const getSlotBgColor = (booked) => booked >= 8 ? "bg-red-100" : booked >= 5 ? "bg-yellow-100" : booked >= 1 ? "bg-green-100" : "bg-white";

  const renderStep = () => {
    if (step === 1) {
      const next7Days = getNext7Days();
      return (
        <>
          <StepTitle title="Select Date" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-3 w-full">
            {next7Days.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg border text-sm text-center w-full ${formatDate(date) === formatDate(selectedDate) ? "bg-blue-600 text-white" : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"}`}
              >
                {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>
          <StepTitle title="ChooseTime" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allTimeSlots.map(time => {
              const booked = bookedSlots[time] || 0;
              const isFull = booked >= 10;
              const isPast = !isSlotFuture(selectedDate, time);
              const disabled = isFull || isPast;
              const bgColor = getSlotBgColor(booked);
              const slotLabel = isPast ? "🔥 Sold Out" : (isFull ? "Full" : `${10 - booked} left`);
              return (
                <button
                  key={time}
                  disabled={disabled}
                  onClick={() => setSelectedTime(time)}
                  type="button"
                  className={`p-3 border rounded-lg text-sm sm:text-base ${bgColor} ${selectedTime === time ? "border-blue-600 text-blue-800" : "text-gray-700 border-gray-300 hover:border-blue-500"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {time}<br /><span className={`text-xs ${isPast ? "text-red-500 font-bold" : ""}`}>{slotLabel}</span>
                </button>
              );
            })}
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <StepTitle title="2. Choose Wash Type" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {washTypes.map((wash) => (
              <button
                key={wash.name}
                onClick={() => setForm({ ...form, washType: wash.name })}
                className={`p-4 border rounded-lg flex flex-col items-center ${form.washType === wash.name ? "border-blue-600 text-blue-800" : "text-gray-800 border-gray-300 hover:border-blue-500"}`}
              >
                {wash.icon}
                <span className="mt-2 font-bold">{wash.name}</span>
                <span className="text-sm">₹{wash.price}</span>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <StepTitle title="3. Enter Your Details" />
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg p-3"
            />
            <input
              type="tel"
              placeholder="10-digit Mobile Number"
              maxLength="10"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <StepTitle title="4. Additional: Want to Save Time?" />
          <p className="text-center text-sm text-gray-700 mb-4">
            Want to make it express? We’ll finish your car in under 35 minutes — without compromising quality. Add ₹199 to skip the line and save hours.
          </p>
          <label className="inline-flex items-center justify-center">
            <input
              type="checkbox"
              checked={form.express}
              onChange={(e) => setForm({ ...form, express: e.target.checked })}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-lg font-medium">Make it Express (₹199)</span>
          </label>
        </>
      );
    }

    if (step === 5) {
      return (
        <div className="text-center space-y-6 p-6 sm:p-8">
          {status === "success" ? (
            <>
              <FiCheckCircle size={60} className="mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p>We'll see you soon 🚗💦</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
              <p className="text-gray-600">Please try again later.</p>
            </>
          )}
          <button onClick={reset} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">Book Another</button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="bg-white px-2 sm:px-4 md:px-6 py-6 sm:py-8 rounded-xl shadow-2xl w-full max-w-7xl mx-auto font-sans">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book Your Car Wash, Don’t Wait!</h1>
          <p className="text-sm text-gray-600 mt-2">Foam Wash, Underbody, or Detailing — fast and clean, just the way it should be.</p>
        </div>
        {step <= 4 && (
          <>
            <div className="mb-6">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(step - 1) * 25}%` }}></div>
              </div>
            </div>
            {renderStep()}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="sm:w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                  <FiArrowLeft className="inline mr-2" />Back
                </button>
              )}
              <button
                onClick={step === 4 ? handleSubmit : () => setStep(step + 1)}
                disabled={isNextDisabled()}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {step === 4 ? `Pay Now (₹${total})` : "Next"}
              </button>
            </div>
          </>
        )}
        {step === 5 && renderStep()}
      </div>
    </>
  );
}