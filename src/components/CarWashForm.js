"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { supabase } from "../supabaseClient";

// Helper functions
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
      i++;
      continue;
    }
    days.push(d);
    i++;
    added++;
  }
  return days;
}

function isSlotFuture(date, slot) {
  const now = new Date();
  const [hourStr, modifier] = slot.split(" ");
  let [hour, minute] = hourStr.split(":").map(Number);
  if (modifier === "PM" && hour !== 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;
  const slotDateTime = new Date(date);
  slotDateTime.setHours(hour, minute, 0, 0);
  return slotDateTime > now;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Pricing logic
const packagePrices = {
  Hatchback: { Basic: 200, Premium: 300, Plus: 400 },
  "Compact SUV": { Basic: 220, Premium: 350, Plus: 600 },
  SUV: { Basic: 250, Premium: 400, Plus: 800 },
};

const waxBrands = {
  Basic: "WaxPol",
  Premium: "3M",
  Plus: "Turtle Wax",
};

const allTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function CarWashForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    express: false,
    vehicleType: "",
    packageTier: ""
  });
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("idle");
  const [bookedSlots, setBookedSlots] = useState({});
  const [store, setStore] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(true);

  const total = useMemo(() => {
    const { vehicleType, packageTier, express } = form;
    const base = vehicleType && packageTier ? packagePrices[vehicleType]?.[packageTier] || 0 : 0;
    return base + (express ? 199 : 0);
  }, [form]);

  // Get user's location and find nearest store
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const { data, error } = await supabase.from("stores").select("*");
        if (error) return;

        const nearest = data.find((s) => {
          if (!s.latitude || !s.longitude) return false;
          const dist = getDistanceFromLatLonInKm(
            latitude, longitude,
            parseFloat(s.latitude),
            parseFloat(s.longitude)
          );
          return dist <= 5;
        });

        if (nearest) {
          setStore(nearest);
        } else {
          setStore(null);
        }
      },
      () => {
        setLocationAllowed(false);
      }
    );
  }, []);

  // Fetch slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!store) return;
      const { data, error } = await supabase
        .from("carwash")
        .select("time")
        .eq("date", formatDate(selectedDate))
        .eq("store_id", store.id);
      if (error) return;
      const slots = data.reduce((acc, entry) => {
        acc[entry.time] = (acc[entry.time] || 0) + 1;
        return acc;
      }, {});
      setBookedSlots(slots);
    };
    fetchSlots();
  }, [selectedDate, store]);

  const isNextDisabled = () => {
    if (step === 1) return !selectedTime;
    if (step === 2) return !form.vehicleType || !form.packageTier;
    if (step === 3) return !form.name || form.phone.length !== 10;
    return false;
  };

  const handleSubmit = async () => {
    setStatus("submitting");
    const payload = {
  name: form.name,
  phone: form.phone,
  express: form.express,
  vehicle_type: form.vehicleType,
  package: form.packageTier,
  date: formatDate(selectedDate),
  time: selectedTime,
  price: total,
  store_id: store?.id,
  lead_source: "Website",  // <-- NEW
  remark: null             // <-- Optional
};


    try {
      const { error } = await supabase.from("carwash").insert([payload]);
      if (error) throw error;
      setStatus("success");
      setStep(5);
    } catch (err) {
      setStatus("error");
      setStep(5);
    }
  };

  const saveLead = async () => {
    await supabase.from("leads").insert([{
      name: form.name,
      phone: form.phone,
      city: "Unknown",
      vehicle: form.vehicleType || "Unknown",
      issue: "Out of service area",
      source: "Website",
      remark: "Location not serviceable"
    }]);
  };

  const reset = () => {
    setStep(1);
    setStatus("idle");
    setForm({ name: "", phone: "", express: false, vehicleType: "", packageTier: "" });
    setSelectedDate(getNext7Days()[0]);
    setSelectedTime("");
  };

  const StepTitle = ({ title }) => (
    <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">{title}</h3>
  );

  const getSlotBgColor = (booked) =>
    booked >= 8 ? "bg-red-100" : booked >= 5 ? "bg-yellow-100" : booked >= 1 ? "bg-green-100" : "bg-white";

  // UI RENDER
  const renderStep = () => {
    if (!store && locationAllowed) {
      return (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-800">⏳ Checking nearest service...</h2>
        </div>
      );
    }

    if (!store && !locationAllowed) {
      return (
        <div className="text-center py-10 space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Location Required</h2>
          <p className="text-sm text-gray-600">We need your location to show available slots near you.</p>
        </div>
      );
    }

    if (!store) {
      return (
        <div className="text-center py-10 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">😞 Not in Service Area</h2>
          <p className="text-gray-500">We're not available in your area yet. Enter details and we'll reach out when we are.</p>
          <div className="grid gap-3 max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-lg p-3 w-full"
            />
            <input
              type="tel"
              placeholder="10-digit Mobile Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.slice(0, 10).replace(/[^0-9]/g, "") })}
              className="border rounded-lg p-3 w-full"
            />
            <button
              onClick={saveLead}
              className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Notify Me When Available
            </button>
          </div>
        </div>
      );
    }

    if (step === 1) {
      const days = getNext7Days();
      return (
        <>
          <StepTitle title="Select Date" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-3 w-full">
            {days.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg border text-sm text-center w-full ${
                  formatDate(date) === formatDate(selectedDate)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                }`}
              >
                {date.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short"
                })}
              </button>
            ))}
          </div>
          <StepTitle title="Choose Time" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allTimeSlots.map((time) => {
              const booked = bookedSlots[time] || 0;
              const isFull = booked >= 10;
              const isPast = !isSlotFuture(selectedDate, time);
              const disabled = isFull || isPast;
              const bgColor = getSlotBgColor(booked);
              const slotLabel = isPast ? "🔥 Sold Out" : isFull ? "Full" : `${10 - booked} left`;
              return (
                <button
                  key={time}
                  disabled={disabled}
                  onClick={() => setSelectedTime(time)}
                  type="button"
                  className={`p-3 border rounded-lg text-sm sm:text-base ${bgColor
                    } ${selectedTime === time
                      ? "border-blue-600 text-blue-800"
                      : "text-gray-700 border-gray-300 hover:border-blue-500"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {time}
                  <br />
                  <span className={`text-xs ${isPast ? "text-red-500 font-bold" : ""}`}>
                    {slotLabel}
                  </span>
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
          <StepTitle title="Choose Vehicle Type" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {Object.keys(packagePrices).map((vehicle) => (
              <button
                key={vehicle}
                onClick={() => setForm({ ...form, vehicleType: vehicle, packageTier: "" })}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center ${form.vehicleType === vehicle
                    ? "border-blue-600 text-blue-800"
                    : "text-gray-800 border-gray-300 hover:border-blue-500"
                  }`}
              >
                <span className="font-bold">{vehicle}</span>
              </button>
            ))}
          </div>

          {form.vehicleType && (
            <>
              <StepTitle title="Choose Package" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["Basic", "Premium", "Plus"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setForm({ ...form, packageTier: tier })}
                    className={`p-4 border rounded-lg flex flex-col items-center justify-center ${form.packageTier === tier
                        ? "border-blue-600 text-blue-800"
                        : "text-gray-800 border-gray-300 hover:border-blue-500"
                      }`}
                  >
                    <span className="text-lg font-semibold">{tier}</span>
                    <span className="text-sm text-gray-500">{waxBrands[tier]}</span>
                    <span className="text-sm font-bold mt-1">
                      ₹{packagePrices[form.vehicleType][tier]}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <StepTitle title="Enter Your Details" />
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
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <StepTitle title="Optional: Make it Express" />
          <p className="text-center text-sm text-gray-700 mb-4">
            We'll finish in under 35 mins. Add ₹199 to skip the line.
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
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
          >
            Book Another
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white px-4 py-6 sm:px-6 sm:py-8 rounded-xl shadow-2xl w-full max-w-5xl mx-auto font-sans">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Book Your Car Wash, Don’t Wait!
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Foam Wash, Underbody, or Detailing — fast and clean, just the way it should be.
        </p>
      </div>
      {step <= 4 && (
        <>
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(step - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          {renderStep()}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="sm:w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <FiArrowLeft className="inline mr-2" />
                Back
              </button>
            )}
            <button
              onClick={step === 4 ? handleSubmit : () => setStep(step + 1)}
              disabled={isNextDisabled()}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {step === 4 ? `Book Now (₹${total})` : "Next"}
            </button>
          </div>
        </>
      )}
      {step === 5 && renderStep()}
    </div>
  );
}
