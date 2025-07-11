import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiZap, FiCheckCircle, FiArrowLeft, FiDroplet, FiSun, FiWind } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";

const customDatePickerStyles = `
  .react-datepicker {
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    font-family: inherit;
    border-radius: 0.5rem;
  }
  .react-datepicker__header { background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; }
  .react-datepicker__current-month, .react-datepicker__day-name { color: #111827; }
  .react-datepicker__day { color: #374151; }
  .react-datepicker__day--selected { background-color: #2563eb; color: white; }
  .react-datepicker__day:hover { background-color: #f3f4f6; }
  .react-datepicker__day--disabled { color: #d1d5db; }
  .react-datepicker__input-container input {
    width: 100%; border: 1px solid #d1d5db; padding: 0.75rem 1rem;
    border-radius: 0.5rem; font-size: 1rem; background-color: #f9fafb;
  }
`;

const washTypes = [
  { name: "Foam Wash", price: 299, icon: <FiDroplet size={20} /> },
  { name: "Underbody Clean", price: 399, icon: <FaCarSide size={20} /> },
  { name: "Interior Detailing", price: 499, icon: <FiSun size={20} /> },
];

export default function CarWashForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", express: false, washType: "" });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("idle");

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
  const selectedWash = washTypes.find(w => w.name === form.washType);
  const total = useMemo(() => (selectedWash ? selectedWash.price : 0) + (form.express ? 199 : 0), [form, selectedWash]);

  const isNextDisabled = () => {
    if (step === 1) return !selectedTime;
    if (step === 2) return !form.washType;
    if (step === 3) return false;
    if (step === 4) return !form.name || !form.phone;
    return false;
  };

  const handleSubmit = async () => {
    setStatus("submitting");
    const payload = {
      data: {
        ...form,
        date: selectedDate?.toLocaleDateString("en-GB"),
        time: selectedTime,
        price: total
      }
    };

    try {
      const res = await fetch("https://sheetdb.io/api/v1/q6qnws041sjwl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setStatus(res.ok ? "success" : "error");
      setStep(5);
    } catch {
      setStatus("error");
      setStep(5);
    }
  };

  const reset = () => {
    setStep(1);
    setStatus("idle");
    setForm({ name: "", phone: "", express: false, washType: "" });
    setSelectedDate(new Date());
    setSelectedTime("");
  };

  const StepTitle = ({ title }) => <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">{title}</h3>;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <StepTitle title="1. Select Date & Time" />
            <DatePicker selected={selectedDate} onChange={setSelectedDate} minDate={new Date()} dateFormat="MMMM d, yyyy" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {timeSlots.map(time => (
                <button key={time} onClick={() => setSelectedTime(time)} type="button"
                  className={`p-3 border rounded-lg ${selectedTime === time ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"}`}>
                  {time}
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <StepTitle title="2. Choose Wash Type" />
            <div className="space-y-3">
              {washTypes.map(opt => (
                <div key={opt.name} onClick={() => setForm({ ...form, washType: opt.name })} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${form.washType === opt.name ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-500"}`}>
                  <div className="text-blue-600">{opt.icon}</div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold">{opt.name}</p>
                    <p className="text-sm text-gray-600">₹{opt.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <StepTitle title="3. Do You Want Express Service?" />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setForm({ ...form, express: false })} type="button" className={`p-4 border rounded-lg ${!form.express ? "bg-blue-600 text-white" : "border-gray-300 bg-white"}`}>No Extra Cost</button>
              <button onClick={() => setForm({ ...form, express: true })} type="button" className={`p-4 border rounded-lg ${form.express ? "bg-blue-600 text-white" : "border-gray-300 bg-white"}`}>Express +₹199</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <StepTitle title="4. Your Details" />
            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border-gray-300 rounded-lg p-3 mb-4" />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border-gray-300 rounded-lg p-3" />
          </>
        );
      case 5:
        return (
          <div className="text-center space-y-6 p-8">
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
      default:
        return null;
    }
  };

  return (
    <>
      <style>{customDatePickerStyles}</style>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl mx-auto font-sans">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Car Wash, Don’t Wait!</h1>
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
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
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
