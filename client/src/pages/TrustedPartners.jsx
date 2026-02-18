import React from 'react';
import floralBg from '../assets/gray-floral.png';

const partners = [
  {
    name: 'StephensCode LLC',
    category: 'Web Development',
    description:
      'The veteran-owned team that designed and built our website. StephensCode has over fourteen years of development experience and more than 2,600 completed projects — specializing in custom websites, web apps, and business automation solutions.',
    url: 'https://stephenscode.dev',
  },
  {
    name: 'ColorFuse Prints',
    category: 'Custom Printing & Apparel',
    description:
      'When our clients need printed keepsakes or branded merchandise for their events, we send them to ColorFuse. They produce high-quality DTF transfers, sublimation prints, and custom apparel with vibrant color and fast turnaround.',
    url: 'https://colorfuseprints.com',
  },
  {
    name: 'SACVPN',
    category: 'VPN & Cybersecurity',
    description:
      'Dedicated VPN infrastructure offering private servers with enterprise-grade encryption and speeds up to 700 Mbps. SACVPN protects business and personal connections without sharing resources across thousands of users. Veteran-owned.',
    url: 'https://sacvpn.com',
  },
  {
    name: 'AMW Cooling & Heating',
    category: 'HVAC Services',
    description:
      'A veteran-owned heating and cooling company serving Conroe, TX and the surrounding area. AMW handles AC repair, heating installation, preventive maintenance, and 24/7 emergency service — licensed, insured, and always reliable.',
    url: 'https://amwairconditioning.com',
  },
  {
    name: 'C.A.R.S Collision & Refinish',
    category: 'Auto Body & Paint',
    description:
      'A veteran and family-owned auto body shop in Spring, TX. C.A.R.S specializes in collision repair, custom paint, paintless dent repair, and spray-in bedliners — serving Spring, The Woodlands, and North Houston with quality you can see.',
    url: 'https://carscollisionandrefinishshop.com',
  },
  {
    name: 'Terracotta Construction',
    category: 'General Contracting',
    description:
      'Professional construction, landscaping, fencing, handyman projects, apartment turnovers, and 24/7 emergency repairs across Montgomery County and the Greater Houston area. Licensed, insured, and committed to doing things right.',
    url: 'https://terracottaconstruction.com',
  },
  {
    name: 'Forge-X',
    category: 'Contractor Management',
    description:
      'A modern project management platform built for contractors. Forge-X brings invoicing, scheduling, daily logs, and payment tracking together in one dashboard — making it simple for contractors and homeowners to stay connected.',
    url: 'https://forge-x.app',
  },
  {
    name: 'Benefit Builder LLC',
    category: 'Benefits Consulting',
    description:
      'A brokerage focused on Section 125 plans and supplemental coverage including life, dental, and vision insurance. Benefit Builder helps employers and employees reduce tax liability through smart pre-tax benefit structures.',
    url: 'https://benefitbuilderllc.com',
  },
  {
    name: 'LotSwap',
    category: 'Automotive Marketplace',
    description:
      'A fee-free dealer-to-dealer vehicle marketplace where dealers list wholesale inventory, negotiate directly, and close deals without the auction middleman — saving $1,500 to $2,500 per vehicle compared to traditional channels.',
    url: 'https://lotswap.io',
  },
  {
    name: 'JustWell Clinical Research',
    category: 'Clinical Research',
    description:
      'Houston\'s trusted resource for ethical, inclusive clinical trials. JustWell runs IRB-approved studies in cardiology, neurology, dermatology, ophthalmology, and family medicine, with compensation available for participants who qualify.',
    url: 'https://justwellclinical.org',
  },
  {
    name: 'GradeStack',
    category: 'SEO & Website Monitoring',
    description:
      'A self-hosted platform that grades your website on performance, SEO, security, accessibility, and best practices — then delivers clear, step-by-step instructions on how to fix every issue it finds.',
    url: 'https://gradestack.dev',
  },
  {
    name: 'Get Step Ready',
    category: 'Medical Education',
    description:
      'A complete USMLE Step 1 study platform with over 50,000 flashcards, 5,000-plus practice questions, video lectures, and AI-powered learning tools that adjust to the pace of each individual student.',
    url: 'https://getstepready.com',
  },
];

export default function TrustedPartners() {
  return (
    <div
      className="min-h-screen text-black px-6 py-12 md:px-20 bg-repeat bg-fixed bg-[length:400px] bg-left-top"
      style={{ backgroundImage: `url(${floralBg})` }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Trusted Local Partners</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            FC Photo Houston is honored to work alongside a network of talented local
            businesses. These are the companies we trust, collaborate with, and recommend
            to everyone we know.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <span className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">
                {partner.category}
              </span>
              <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {partner.description}
              </p>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener"
                className="inline-block px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition"
              >
                Visit Website →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
