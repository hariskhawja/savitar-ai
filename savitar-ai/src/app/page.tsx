/* eslint-disable @next/next/no-img-element */
"use client";

import { useChat } from "ai/react";
import { DragEvent, useEffect, useRef, useState } from "react";
import { User, Bot, ChevronRight, CheckCircle, FileText, Paperclip } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { Markdown } from "@/components/markdown";
import { Button } from '@/components/ui/button'
import Image from "next/image";

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  return window.atob(base64);
};

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

const quickRepliesList = [
  "How do tax brackets work?",
  "Tell me about deductions",
  "What is a W-2 form?",
  "How do I file my taxes?",
  "Tell me about tax credits",
  "What is a tax refund?",
  "How does withholding work?",
  "What are the tax rates for 2025?",
  "What is a tax audit?"
]  

function getRandomQuickReplies(arr : Array<String>) {
  // Shuffle the array using Fisher-Yates algorithm
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]]; // Swap
  }

  // Return the first 3 elements from the shuffled array
  return shuffledArr.slice(0, 3);
}

export default function Home() {
  const [quickReplies, setQuickReplies] = useState(Array<String>);

  useEffect(() => {
    // Only run this on the client side after the component mounts
    setQuickReplies(getRandomQuickReplies(quickRepliesList));
  }, []); // Empty dependency array ensures this runs only once, after mounting

  const { messages, input, handleSubmit, handleInputChange, isLoading, append } =
    useChat({
      onError: () =>
        toast.error("You've been rate limited, please try again later!"),
    });

  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for the hidden file input
  const [isDragging, setIsDragging] = useState(false);

  const [viewFiles, setViewFiles] = useState(true);

  const handleAppend = (reply : String) => {
    append({
      role: "user",
      content: `${reply}`,
    })  

    setQuickReplies(getRandomQuickReplies(quickRepliesList))
  }

  const handleFileDelete = (index : number) => {
    if (files) {
      const updatedFilesArray = Array.from(files).filter((_, i) => i !== index)

      setTimeout(() => {
        const updatedFiles = new DataTransfer();
        updatedFilesArray.forEach(file => updatedFiles.items.add(file));  
        setFiles(updatedFiles.files);

        if (updatedFilesArray.length === 0) {
          setViewFiles(true)
          setFiles(null)
        }
      }, 200);
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/") || file.type === "application/pdf"
        );

        if (validFiles.length > 5) {
          toast.error("Maximum of 5 files are allowed!")
        }
        
        else {
          if (validFiles.length === files.length) {
            const dataTransfer = new DataTransfer();
            validFiles.forEach((file) => dataTransfer.items.add(file));
            setFiles(dataTransfer.files);
            setViewFiles(true)
          } else {
            toast.error("Only image, text, and pdf files are allowed");
          }  
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/") || file.type === "application/pdf"
      );

      if (validFiles.length > 5) {
        toast.error("Maximum of 5 files are allowed!")
      }

      else {
        if (validFiles.length === droppedFilesArray.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
          setViewFiles(true);
        } else {
          toast.error("Only image, text, and pdf files are allowed!");
        }  

        setFiles(droppedFiles);
      }
    }
    setIsDragging(false);
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle file selection via the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle files selected from the file dialog
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/") || file.type === "application/pdf"
      );

      if (validFiles.length > 5) {
        toast.error("Maximum of 5 files are allowed!")
      }

      else {
        if (validFiles.length === selectedFiles.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
          setViewFiles(true);
        } else {
          toast.error("Only image, text, and pdf files are allowed!");
        }
      }
    }
  };

  return (
    <div className="bg-white">
      <title>Savitar AI</title>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <Toaster />
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/logo.png"
                width={125}
                height={100}
                alt="Savitar AI"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
                <Button className="cursor-pointer transition-colors flex-right ml-auto text-md bg-white text-black hover:text-[#45619F] shadow-none hover:bg-blue-50">
                Home
                </Button>
            </Link>
            <Link href="/">
                <Button className="cursor-pointer transition-colors flex-right ml-auto text-md bg-white text-black hover:text-[#45619F] hover:bg-white shadow-none hover:bg-blue-50">
                Security
                </Button>
            </Link>
            <Link href="/">
                <Button className="cursor-pointer transition-colors flex-right ml-auto text-md shadow-none bg-blue-50 text-[#45619F] hover:bg-blue-100">
                Savitar AI
                </Button>
            </Link>
          </nav>
          <button className="cursor-pointer px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors rounded-full bg-[#45619F] hover:bg-[#324673]">
            Book a demo
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="hidden w-64 p-4 border-r border-gray-200 md:block bg-white">
          <div className="mb-6">
            <div className="flex items-center gap-2 p-2 mb-4 bg-blue-50 rounded-lg">
              <span className="px-2 py-0.5 text-xs font-medium text-white bg-[#45619F] transition-colors rounded-full hover:bg-[#324673]">New</span>
              <span className="text-sm font-medium">Maximize profit with Savitar AI</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold">Recent Chats</h2>
            <div className="space-y-2">
              <button className="cursor-pointer flex items-center justify-between w-full p-2 text-left transition-colors rounded-lg hover:bg-gray-100 bg-blue-50">
                <span className="text-sm font-medium">Tax Preparation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="cursor-pointer flex items-center justify-between w-full p-2 text-left transition-colors rounded-lg hover:bg-gray-100">
                <span className="text-sm font-medium">Client Onboarding</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="cursor-pointer flex items-center justify-between w-full p-2 text-left transition-colors rounded-lg hover:bg-gray-100">
                <span className="text-sm font-medium">Document Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Progress</h2>
            <div className="p-3 mb-4 bg-white border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">Checklist Progress</span>
                </div>
                <span className="text-sm font-medium">90%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <motion.div 
                  className="transition-colors h-2 rounded-full bg-[#45619F] hover:bg-[#324673]" 
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 0.8 }}
                >
                </motion.div>
              </div>
            </div>
            <div className="p-3 bg-white border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-[#45619F]" />
                <h3 className="text-sm font-medium">Documents</h3>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">W2</span>
                  <span className="px-1.5 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">2</span>
                </div>
                <ul className="pl-5 text-xs text-gray-600 list-disc">
                  <li>w2-haris-khawja.pdf</li>
                  <li>w2-omraan-khawja.pdf</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">1099</span>
                  <span className="px-1.5 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">2</span>
                </div>
                <ul className="pl-5 text-xs text-gray-600 list-disc">
                  <li>1099-div-fidelity.pdf</li>
                  <li>1099-interest-chase.pdf</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      {/* Middle */}
      <div className="flex flex-col flex-1 overflow-hidden h-[calc(100vh-75px)]" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mt-6">
          {/* Initial Message by AI */}
          <motion.div
              key="initialMssg"
              className="flex justify-start"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-start max-w-[80%] gap-2">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 ml-4 mr-2 rounded-full bg-blue-100">
                  <Bot className="w-4 h-4 text-[#45619F]" />
                </div>
              </div>
              <div className="px-4 pt-2 pb-2 rounded-2xl max-w-[80%] bg-white border border-gray-200">
                <Markdown>
                  Hello! I'm Savitar AI, your virtual assistant for all things tax and accounting. Whether you need help understanding your W-2 form, tax brackets, deductions, or anything else related to taxes, I'm here to assist you. You can even upload documents for me to analyse for you! I can also create markdown tables if requested! How can I help you today?
                </Markdown>
              </div>
          </motion.div>

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >

              {/* Assistant Icon */}
              <div className="flex items-start max-w-[80%] gap-2">
                  {message.role === "assistant" && (
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 ml-4 mr-2 rounded-full bg-blue-100">
                      <Bot className="w-4 h-4 text-[#45619F]" />
                    </div>
                  )}
              </div>
              
              {/* Message Bubbles */}
              <div className={`px-4 pt-2 pb-2 rounded-2xl max-w-[80%] ${message.role === "user" ? "bg-[#45619F] text-white" : "bg-white border border-gray-200"}`}>
                <Markdown>{message.content}</Markdown>
                  
                {/* Files in Messages */}
                <div className="flex flex-row flex-wrap gap-2">
                  {message.experimental_attachments?.map((attachment) =>
                    attachment.contentType?.startsWith("image") ? (
                      <img
                        className="rounded-md w-40 mb-3 mt-3"
                        key={attachment.name}
                        src={attachment.url}
                        alt={attachment.name}
                      />
                    ) : attachment.contentType?.startsWith("text") ? (
                      <div className="mt-3 text-xs w-40 h-24 overflow-hidden text-zinc-400 border p-2 rounded-md dark:bg-zinc-800 dark:border-zinc-700 mb-3">
                        {getTextFromDataUrl(attachment.url)}
                      </div>
                    ) : attachment.contentType === "application/pdf" ? (
                      <iframe
                        key={attachment.name}
                        src={attachment.url}
                        className="w-[100%] border rounded-md mt-3"
                        title={attachment.name}
                      />
                    ) : null
                  )}
                </div>
                <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                </div>
              </div>
              
              {/* User Icon */}
              {message.role === "user" && (
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 mr-4 ml-2 rounded-full bg-gray-100">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              
            </motion.div>
          ))}

          {/* AI Loading */}
          {isLoading &&
            messages[messages.length - 1].role !== "assistant" && (
              <div className="flex items-start max-w-[80%] gap-2">
                <div className="ml-4 flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-gray-100">
                  <Bot className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex flex-col gap-1 text-zinc-400">
                  <div>Thinking...</div>
                </div>
              </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={(event) => {
            const options = files ? { experimental_attachments: files } : {}
            
            const allowEmptySubmit = Object.keys(options).length !== 0 && options.constructor === Object

            handleSubmit(event, { ...options, allowEmptySubmit })
            setQuickReplies(getRandomQuickReplies(quickRepliesList))
            setFiles(null)
          }}
        >

          {/* Attachment Preview Area */}
          <AnimatePresence>
            {files && files.length > 0 && viewFiles && (
              <div className="mb-17 flex flex-row gap-2 absolute bottom-12 px-4 w-[75%] md:px-0">
                {Array.from(files).map((file, index) =>
                  file.type.startsWith("image") ? (
                    <div key={file.name} onClick={() => handleFileDelete(index)}>
                      <motion.img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="border rounded-md w-16 cursor-pointer"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{
                          y: -10,
                          scale: 1.1,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                        whileHover={{ scale: 1.6, opacity: 0.5 }}
                        onClick={() => handleFileDelete(index)}
                      />
                    </div>
                  ) : file.type.startsWith("text") ? (
                    <motion.div
                      key={file.name}
                      className="border text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white cursor-pointer"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{
                        y: -10,
                        scale: 1.1,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      whileHover={{ scale: 1.6, opacity: 0.5 }}
                      onClick={() => handleFileDelete(index)}
                    >
                      <TextFilePreview file={file} />
                    </motion.div>
                  ) : file.type === "application/pdf" ? (
                        <motion.div
                          key={file.name}
                          className="text-[5pt] relative flex flex-col justify-center items-center w-15 h-15 bg-gray-300 text-black dark:text-white rounded-lg cursor-pointer border"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 1 }}
                          exit={{
                            y: -10,
                            scale: 1.1,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                          whileHover={{ scale: 1.6, opacity: 0.5 }}
                          onClick={() => handleFileDelete(index)}
                        >
                        <span className="ml-1">
                          {file.name.replaceAll('_', ' ').replaceAll('-', ' ')}
                        </span>
                        <span className="ml-1 mr-auto font-bold">PDF</span>
                    </motion.div>
              ) : null
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {/* File Upload Button */}
          <div className="flex items-center w-[75%] max-w-[calc(100dvw-32px)] bg-zinc-100 rounded-full px-4 py-2 mb-4">
            <button
              type="button"
              onClick={handleUploadClick}
              className="cursor-pointer flex items-center justify-center w-10 h-10 text-gray-500 transition-colors rounded-full hover:text-zinc-700 dark:hover:text-zinc-100 focus:outline-none"
              aria-label="Upload Files"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Message Input */}
            <input
              ref={inputRef}
              className="bg-transparent flex-grow outline-none text-zinc-800 dark:text-zinc-300 placeholder-zinc-400"
              placeholder="Send a message..."
              value={input}
              onChange={handleInputChange}
              onPaste={handlePaste}
            />

            {files && files.length > 0 && (
              <motion.div
                key="viewHide"
                className="text-md cursor-pointer font-bold"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setViewFiles(!viewFiles)}
                exit={{
                  y: -10,
                  scale: 0.5,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                whileHover={{ scale: 1, opacity: 0.5,  }}
              >
                <span className="text-right text-[#45619F]">{viewFiles ? "Hide" : "View"}</span>
              </motion.div>
            )}
          </div>

          {files && files.length > 0 && (
            <motion.div
              key="fileStatement"
              className="text-sm mt-[-10] mb-1"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                y: -10,
                scale: 0.5,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              whileHover={{ scale: 1.2, opacity: 0.5 }}
            >
              <span className="text-center text-sm text-[#45619F]">Click on file to delete</span>
            </motion.div>
          )}

          {!files && input.length === 0 && (
            <motion.div
              key="quickReplies"
              className="text-sm mt-[-10] mb-1 flex flex-row gap-8 center text-center"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                y: -10,
                scale: 0.5,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
            >
              {quickReplies.map((reply, index) => (
                <motion.div 
                key={index} 
                className="text-center font-bold text-sm text-[#45619F] cursor-pointer hover:underline"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  y: -10,
                  scale: 0.5,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleAppend(reply)}
                >
                  {reply}
                </motion.div>
              ))}
              </motion.div>
          )}

        </form>


      </div>

        {/* Right Sidebar */}
        <div className="hidden w-80 p-4 border-l border-gray-200 md:block bg-white">
          <div className="p-4 mb-4 bg-white border rounded-lg">
            <h3 className="mb-3 text-sm font-medium">Client Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                <div className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full bg-blue-100">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full bg-green-100">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full bg-purple-100">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <button className="cursor-pointer px-3 py-1.5 text-xs font-medium text-white transition-colors rounded-md bg-[#45619F] hover:bg-[#324673]">
                Draft Client Email
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Client Name:</span>
                <span className="text-xs font-medium">Khawja Family</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Tax Year:</span>
                <span className="text-xs font-medium">2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Status:</span>
                <span className="text-xs font-medium text-green-600">In Progress</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border rounded-lg">
            <h3 className="mb-3 text-sm font-medium">Questionnaire</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">Moved</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Sold a property</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Changed jobs</span>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Had a child</span>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}