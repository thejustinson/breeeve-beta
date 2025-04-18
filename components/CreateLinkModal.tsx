"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUploadThing } from "@/utils/uploadthing";
import { usePrivy } from "@privy-io/react-auth";

type CreateLinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type UserData = {
  username: string;
  balance: string;
  email: string;
  publickey: string;
  // ... other fields
};

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (data) => {
      console.log("upload complete", data);
    },
  });
  const { user } = usePrivy();
  
  const initialFormData = {
    // Step 1: Basic Info
    name: "",
    slug: "",
    description: "",
    // Step 2: Payment Settings
    amount: "",
    isFlexibleAmount: false,
    currency: "USDC",
    paymentLimit: "",
    expirationDate: "",
    // Step 3: Product Delivery
    isDigitalProduct: false,
    productImages: [] as File[],
    downloadLink: "",
    // Step 4: Final Setup
    redirectUrl: "",
    enableEmailNotifications: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('userdata');
      if (userData) {
        const parsedUserData: UserData = JSON.parse(userData);
        setUsername(parsedUserData.username);
      }
    } catch (error) {
      console.error('Error parsing userdata from localStorage:', error);
    }
  }, []);

  const resetForm = () => {
    setStep(1);
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generatePaymentLink = (username: string, slug: string) => {
    return `breeeve.com/pay/${username}/${slug}`;
  };

  const createLink = async (data: any) => {
    const response = await fetch("/api/links/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step !== 4) {
      // Validate required fields before proceeding to the next step
      if (step === 3 && formData.isDigitalProduct) {
        if (formData.productImages.length === 0) {
          setUploadError('Please upload at least one product image');
          setTimeout(() => setUploadError(null), 3000);
          return;
        }
        if (!formData.downloadLink) {
          setUploadError('Please provide a download link');
          setTimeout(() => setUploadError(null), 3000);
          return;
        }
      }
      
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrls = null;
      
      // Upload images if this is a digital product
      if (formData.isDigitalProduct && formData.productImages.length > 0) {
        const uploadResult = await startUpload(formData.productImages);
        if (uploadResult) {
          console.log("Uploaded images:", uploadResult);
          imageUrls = JSON.stringify(uploadResult.map(img => img.ufsUrl));
        }
      }
      
      const paymentLink = generatePaymentLink(username, formData.slug);
      
      const submissionData = {
        user_id: user?.id,
        name: formData.name,
        description: formData.description,
        link: paymentLink,
        amount: formData.isFlexibleAmount ? null : parseFloat(formData.amount),
        is_flexible_amount: formData.isFlexibleAmount,
        currency: formData.currency,
        payment_limit: formData.paymentLimit ? parseInt(formData.paymentLimit) : null,
        expires_at: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null,
        redirect_url: formData.redirectUrl || null,
        enable_notifications: formData.enableEmailNotifications,
        // Add product data if this is a digital product
        product: formData.isDigitalProduct ? {
          download_link: formData.downloadLink,
          image_urls: imageUrls
        } : null
      };

      const response = await createLink(submissionData);
      console.log("Response:", response);
      
      handleClose();
    } catch (error) {
      console.error('Error creating payment link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: 15, transition: { duration: 0.3 } }
  };

  // Progress indicator based on step
  const progress = (step / 4) * 100;

  // Add file input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        productImages: Array.from(e.target.files)
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + formData.productImages.length > 3) {
      setUploadError('You can only upload up to 3 images');
      setTimeout(() => setUploadError(null), 3000);
      return;
    }

    setFormData({
      ...formData,
      productImages: [...formData.productImages, ...imageFiles].slice(0, 3)
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length + formData.productImages.length > 3) {
        setUploadError('You can only upload up to 3 images');
        setTimeout(() => setUploadError(null), 3000);
        return;
      }

      setFormData({
        ...formData,
        productImages: [...formData.productImages, ...imageFiles].slice(0, 3)
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      productImages: formData.productImages.filter((_, i) => i !== index)
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Create Payment Link
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span className="font-medium">Step {step} of 4: {
                      step === 1 ? "Basic Info" : 
                      step === 2 ? "Payment Settings" :
                      step === 3 ? "Product Delivery" : 
                      "Final Setup"
                    }</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-deep"
                      initial={{ width: `${(step-1)/4 * 100}%` }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {step === 1 && (
                    <motion.div
                      {...fadeInUp}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title*
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const cleanSlug = name
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^a-z0-9-]/g, "")
                              .replace(/-+/g, "-")
                              .replace(/^-|-$/g, "");
                            
                            setFormData({
                              ...formData,
                              name,
                              slug: cleanSlug,
                            });
                          }}
                          className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 transition-all shadow-sm text-gray-900 placeholder-gray-400"
                          placeholder="What's this link for?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Link (Optional)
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                          This will be the link to your payment page. If you don&apos;t have a custom link in mind, we&apos;ll generate one for you from your title.
                        </p>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => {
                              const cleanSlug = e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9-]/g, "")
                                .replace(/-+/g, "-")
                                .replace(/^-|-$/g, "");
                              
                              setFormData({ ...formData, slug: cleanSlug });
                            }}
                          className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 transition-all shadow-sm text-gray-900 placeholder-gray-400"
                            placeholder="your-link-name"
                          />
                        <div className="mt-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                          Preview: breeeve.com/pay/{username}/{formData.slug || "your-link-name"}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 transition-all shadow-sm text-gray-900"
                          placeholder="Leave a description to help your customers understand what they're paying for."
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      {...fadeInUp}
                      className="space-y-6"
                    >
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Amount Type
                        </label>
                        <div className="space-y-4">
                          <div className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                            <input
                              type="radio"
                              id="fixed-amount"
                              checked={!formData.isFlexibleAmount}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  isFlexibleAmount: false,
                                })
                              }
                              className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20"
                            />
                            <label htmlFor="fixed-amount" className="ml-3 text-sm text-gray-700 font-medium">
                              Fixed Amount (USDC)
                            </label>
                          </div>
                          {!formData.isFlexibleAmount && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-8"
                            >
                              <div className="relative">
                                <input
                                  type="number"
                                  value={formData.amount}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      amount: e.target.value,
                                    })
                                  }
                                  className="w-full pl-[68px] pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900"
                                  placeholder="0.00"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">
                                  USDC
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                            <input
                              type="radio"
                              id="flexible-amount"
                              checked={formData.isFlexibleAmount}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  isFlexibleAmount: true,
                                  amount: "",
                                })
                              }
                              className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20"
                            />
                            <label htmlFor="flexible-amount" className="ml-3 text-sm text-gray-700 font-medium">
                              Flexible Amount (Buyer chooses)
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Limits (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.paymentLimit}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentLimit: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900"
                            placeholder="Maximum number of payments allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.expirationDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expirationDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      {...fadeInUp}
                      className="space-y-6"
                    >
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          id="digital-product"
                          checked={formData.isDigitalProduct}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isDigitalProduct: e.target.checked,
                            })
                          }
                          className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20 rounded"
                        />
                        <label htmlFor="digital-product" className="ml-3 text-sm font-medium text-gray-700">
                          This link is for a digital product
                        </label>
                      </div>

                      {formData.isDigitalProduct && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Product Images {formData.isDigitalProduct && <span className="text-red-500">*</span>}
                            </label>
                            <div 
                              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative
                                ${isDragging ? 'border-purple-deep bg-purple-deep/5' : 'border-gray-200 hover:border-purple-deep/30'}`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInput}
                                accept="image/*"
                                multiple
                                className="hidden"
                              />
                              <div className="space-y-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">
                                  Drag & drop images here or <span className="text-purple-deep">browse</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                  Supported formats: JPG, PNG, GIF (max 5MB each)
                                </p>
                              </div>
                              {uploadError && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-50 text-red-500 text-sm px-3 py-1 rounded-lg">
                                  {uploadError}
                                </div>
                              )}
                            </div>
                            {formData.productImages.length > 0 && (
                              <div className="mt-4 grid grid-cols-3 gap-4">
                                {formData.productImages.map((file, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Download Link {formData.isDigitalProduct && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="url"
                              value={formData.downloadLink}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  downloadLink: e.target.value,
                                })
                              }
                              required={formData.isDigitalProduct}
                              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900 placeholder-gray-400"
                              placeholder="Enter download link (Google Drive, IPFS, etc.)"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Automatically sent to buyer after payment is confirmed
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      {...fadeInUp}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Link Preview
                        </label>
                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-purple-deep overflow-hidden">
                          <span className="truncate">
                            {generatePaymentLink(username, formData.slug || "your-link-name")}
                          </span>
                          <button 
                            type="button"
                            className={`ml-auto text-xs px-2 py-1 rounded-md border transition-colors ${
                              isCopied 
                                ? 'bg-green-500 text-white border-green-500' 
                                : 'text-gray-500 hover:text-gray-700 bg-white border-gray-200'
                            }`}
                            onClick={() => {
                              navigator.clipboard.writeText(generatePaymentLink(username, formData.slug || "your-link-name"));
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }}
                          >
                            {isCopied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.redirectUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              redirectUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900"
                          placeholder="Enter URL to redirect after payment"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Where to send customers after successful payment
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            checked={formData.enableEmailNotifications}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                enableEmailNotifications: e.target.checked,
                              })
                            }
                            className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20 rounded"
                          />
                          <label htmlFor="email-notifications" className="ml-3 text-sm font-medium text-gray-700">
                            Enable email notifications for payments
                          </label>
                        </div>
                        <p className="mt-1 ml-8 text-xs text-gray-500">
                          Get notified when someone makes a payment to this link
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between pt-8 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className={`px-6 py-3 text-sm font-medium rounded-xl transition-colors ${
                        step === 1
                          ? "invisible"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-purple-deep text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        step === 4 ? "Create Link" : "Next"
                      )}
                    </motion.button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}