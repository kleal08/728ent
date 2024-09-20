"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from "next/link";

export default function SignUp() {
  const paperStyle = {
    padding: '50px 20px',
    width: 600,
    margin: '20px auto',
    backgroundColor: '#fff',
  };
  
  const router = useRouter(); // Initialize the router

  const [isMobile, setIsMobile] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [submitted, setSubmitted] = useState(false); 
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust width for mobile detection
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const validatePhone = (number: string): boolean => {
    const albanianRegex = /^(?:\+355|0)?(67[0-9]{7}|06[0-9]{7}|(?:[2-9][0-9]{6,7}))$/;
    const europeanRegex = /^\+?(?:[3-9][0-9]{8,12}|4[0-9]{9,12}|5[0-9]{9,12}|6[0-9]{9,12}|7[0-9]{9,12}|8[0-9]{9,12}|9[0-9]{9,12})$/;
  
    // Strip out any leading spaces and ensure the number is in string format
    const cleanedNumber = number.trim();
  
    let isValid;
    if (cleanedNumber.startsWith('355') || cleanedNumber.startsWith('06')) {
      isValid = albanianRegex.test(cleanedNumber);
    } else {
      isValid = europeanRegex.test(cleanedNumber);
    }
  
    console.log("Is phone valid:", isValid); // Log the result
    return isValid;
  };
  
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("Phone number:", phone);
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number.');
      return;
    } else {
      setPhoneError('');
    }

    const candidate = { name, surname, gender, phone };
    console.log(candidate);

    try {
      // Get the gender count first
      const genderCountResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/getCountByGender?gender=${gender}`);
      console.log(genderCountResponse)
      
      if (!genderCountResponse.ok) {
        throw new Error("Error fetching gender count");
      }
  
      const count = await genderCountResponse.json();
      
      if (count < 150) {
        // If the count is valid, try adding the candidate
        const addCandidateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(candidate)
        });
  
        if (!addCandidateResponse.ok) {
          throw new Error("Error adding candidate");
        }

        // Candidate added successfully
        console.log("New Candidate added");
        setSubmitted(true); // Mark as submitted
        
        // Optional: Redirect if needed
        // router.push('/thank-you');
      } else {
        setIsSoldOut(true); // Show "sold out" message if limit is reached
      }
    } catch (error) {
      console.error("Error in submission process:", error);
    }
  };

  return (
    <section>
      {isMobile && (
        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            style={{ opacity: 0.2 }}
          >
            <source src="/videos/728v1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {submitted ? (
            <div className="text-center">
              <img src="/images/Invitation.jpg" alt="Thank You" className="mx-auto" /> {/* Static image */}
            </div>
          ) : (
            <>
              <div className="pb-12 text-center">
              
              </div>
              <form className="mx-auto max-w-[400px]" onSubmit={handleClick}>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-input w-full"
                      placeholder="Your first name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="surname">
                      Surname <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="surname"
                      type="text"
                      className="form-input w-full"
                      placeholder="Your last name"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="male"
                          checked={gender === 'male'}
                          onChange={(e) => setGender(e.target.value)}
                          required
                          className="form-radio"
                        />
                        <span className="ml-2">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="female"
                          checked={gender === 'female'}
                          onChange={(e) => setGender(e.target.value)}
                          required
                          className="form-radio"
                        />
                        <span className="ml-2">Female</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-200/65" htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className="form-input w-full"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                      {phoneError && <p className="text-red-500">{phoneError}</p>} {/* Show error message */}
                  </div>
                </div>
                <div className="mt-6 space-y-5">
                  <button type="submit" className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]">
                    Submit
                  </button>
                  {isSoldOut && (
                  <p className="text-red-500 text-center mt-4">Sorry, the show is sold out!</p>
                )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
      <p>Powered by</p>
        <img src="/images/MoonON-Ready.png" className="mx-auto" width={60} height={60}/> {/* Static image */}
      </footer>
    </section>
  );
}