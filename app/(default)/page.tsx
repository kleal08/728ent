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
  const [videoLoaded, setVideoLoaded] = React.useState(false);


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
    const albanianRegex = /^(?:\+355|0)?(69[0-9]{7}|68[0-9]{7}|67[0-9]{7})$/;
    const europeanRegex = /^\+?(?:[3-9][0-9]{8,12}|4[0-9]{9,12}|5[0-9]{9,12}|6[0-9]{9,12}|7[0-9]{9,12}|8[0-9]{9,12}|9[0-9]{9,12})$/;

    const cleanedNumber = number.trim();

    if (cleanedNumber.startsWith('+355') || cleanedNumber.startsWith('06')) {
      return albanianRegex.test(cleanedNumber);
    }

    console.log("Is phone valid:", albanianRegex.test(cleanedNumber));
    return europeanRegex.test(cleanedNumber);
  };

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number.');
      return;
    } else {
      setPhoneError('');
    }

    const candidate = { name, surname, gender, phone };
    console.log(candidate);

    //setIsSoldOut(true);


  try {
    const countRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/getCountByGender?gender=${gender}`);
    if (!countRes.ok) {
      throw new Error('Failed to fetch count');
    }

    const count = await countRes.json();
    console.log('Current count:', count);

    if (count <= 150) {
      const submitRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });

      if (!submitRes.ok) {
        throw new Error('Failed to submit candidate');
      }

      console.log("New Candidate added");
      setSubmitted(true); 
    } else {
      setIsSoldOut(true);
    }
  } catch (error) {
    console.error("Error in submission process:", error);
    // Optionally, set an error state to show the user
  }
};

  return (
    <section>
       {isMobile && (
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        {!videoLoaded && (
          <img
            src="/images/placeholder-img.png"
            alt="Background placeholder"
            className="absolute w-full h-full object-cover"
            style={{ opacity: 0.4 }}
          />
        )}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ opacity: 0.4 }}
        >
          <source src="/videos/728-compressed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {submitted ? (
            <div className="text-center">
              <img src="/images/Selected.jpg" alt="Thank You" className="mx-auto" loading="lazy"/>
            </div>
          ) : (
            <>
              {isSoldOut ? (
                <div className="text-center">
                  <img src="/images/SoldOut.png" alt="Sold Out" className="mx-auto" style={{ width: '300px', height: 'auto' }} />
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
                          autoComplete="off"
                          className="form-input w-full border-2 border-purple-500 bg-white/80 placeholder:text-gray-400 text-gray-900 focus:ring-0 focus:border-purple-700 outline-none shadow-[0_0_10px_rgba(128,0,255,0.6)] transition-shadow focus:shadow-[0_0_15px_rgba(128,0,255,0.8)]"
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
                          autoComplete="off"
                          className="form-input w-full border-2 border-purple-500 bg-white/80 placeholder:text-gray-400 text-gray-900 focus:ring-0 focus:border-purple-700 outline-none shadow-[0_0_10px_rgba(128,0,255,0.6)] transition-shadow focus:shadow-[0_0_15px_rgba(128,0,255,0.8)]"
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
                          autoComplete="off"
                          className="form-input w-full border-2 border-purple-500 bg-white/80 placeholder:text-gray-400 text-gray-900 focus:ring-0 focus:border-purple-700 outline-none shadow-[0_0_10px_rgba(128,0,255,0.6)] transition-shadow focus:shadow-[0_0_15px_rgba(128,0,255,0.8)]"
                          placeholder="Your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                        {phoneError && <p className="text-red-500">{phoneError}</p>} {/* Show error message */}
                      </div>
                    </div>
                    <div className="mt-6 space-y-5">
                      <button type="submit"
                      className="btn w-full bg-gradient-to-t from-purple-600 to-indigo-500 text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)] hover:bg-gradient-to-b hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105"                        disabled={isSoldOut}>
                        Submit
                      </button>
                      {/* {isSoldOut && (
                        <p className="text-red-500 text-center mt-4">Sorry, the show is sold out!</p>
                      )} */}
                        <div className="text-center mt-4">
                        <a
                          href="https://www.instagram.com/728.ent?igsh=MXh4bTdzdWl5MjRhNA%3D%3D&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-transparent bg-clip-text bg-gradient-to-t from-purple-600 to-indigo-500 hover:bg-gradient-to-b hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 ease-in-out"
                          >
                        Got a question? Reach us out!
                        </a>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Powered by</p>
        <div className="flex justify-center items-center space-x-4 mt-2">
          <img src="/images/MoonON-Ready.png" className="inline-block" width={60} height={60} alt="Logo 1" />
          <img src="/images/GP.png" className="inline-block" width={25} height={10} alt="Logo 2" />
        </div>
      </footer>
    </section>
  );
}
