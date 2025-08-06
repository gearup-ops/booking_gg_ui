'use client'

import { useSelector, useDispatch } from 'react-redux'
import { ChevronDown } from 'lucide-react'
import { RootState } from '@/lib/store'
import { toggleFAQ } from '@/lib/slices/uiSlice'

export default function FAQSection() {
  const dispatch = useDispatch()
  const openFAQ = useSelector((state: RootState) => state.ui.openFAQ)

  const faqs = [
    {
      id: 'faq1',
      question: 'What are your service hours?',
      answer: 'We provide services from 9 AM to 6 PM, Monday to Saturday. Sunday services are available on request.'
    },
    {
      id: 'faq2',
      question: 'Do you provide warranty on services?',
      answer: 'Yes, we provide a 30-day warranty on all our services and genuine parts used.'
    },
    {
      id: 'faq3',
      question: 'How do I book a service?',
      answer: 'You can book a service through our website, mobile app, or by calling our customer service number.'
    },
    {
      id: 'faq4',
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, UPI, credit/debit cards, and digital wallets for your convenience.'
    }
  ]

  return (
    <section className="py-16 bg-[#060608]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#fbbf24]">
          FAQ's
        </h2>
        <p className="text-center text-gray-300 mb-12">
          Clear your doubts by frequently asked questions by customers
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-[#3c3d3f] rounded-lg border border-[#4a4b4d]">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#2a2b2d] transition-colors rounded-lg text-white"
                onClick={() => dispatch(toggleFAQ(faq.id))}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
