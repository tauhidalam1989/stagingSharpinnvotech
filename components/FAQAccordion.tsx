'use client'

import { useState } from 'react'

interface FAQItemProps {
    id: string
    question: string
    answer: string
}

export default function FAQAccordion({ id, question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false)
    const accordionId = id

    return (
        <div className="mb-[15px] overflow-hidden">
            <div
                id={`${accordionId}-header`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer transition-all duration-300 rounded-[2px] ${isOpen ? 'text-white' : 'text-zinc-800'
                    }`}
                style={{
                    backgroundColor: isOpen ? '#0d6efd' : '#F4F7FE'
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <span className="text-sm font-bold">
                    {question}
                </span>
                <span className={`flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-zinc-400 rotate-0'}`}>
                    <i className="fas fa-chevron-down" />
                </span>
            </div>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isOpen ? '1000px' : '0',
                    opacity: isOpen ? '1' : '0',
                    visibility: isOpen ? 'visible' : 'hidden',
                    backgroundColor: '#ffffff'
                }}
            >
                <div className="p-[15px] pt-[15px] text-zinc-600 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    )
}
