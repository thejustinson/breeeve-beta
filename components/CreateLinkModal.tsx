"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

type CreateLinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
    productImages: [] as string[],
    downloadLink: "",

    // Step 4: Final Setup
    redirectUrl: "",
    enableEmailNotifications: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log(formData);
    onClose();
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: 15, transition: { duration: 0.3 } }
  };

  // Progress indicator based on step
  const progress = (step / 4) * 100;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 gradient-text">
                    Create Payment Link
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Step {step} of 4: {
                      step === 1 ? "Basic Info" : 
                      step === 2 ? "Payment Settings" :
                      step === 3 ? "Product Delivery" : 
                      "Final Setup"
                    }</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-deep to-purple-500"
                      initial={{ width: `${(step-1)/4 * 100}%` }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      {...fadeInUp}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Link Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setFormData({
                              ...formData,
                              name,
                              // Auto-generate slug if not manually set
                              slug:
                                formData.slug ||
                                name.toLowerCase().replace(/\s+/g, "-"),
                            });
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 transition-all shadow-sm"
                          placeholder="Internal name for identification"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug (Optional)
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden focus-within:border-purple-deep/20 focus-within:ring-2 focus-within:ring-purple-deep/10 transition-all">
                          <span className="px-4 text-gray-500 bg-gray-100/50 py-3 border-r border-gray-200">
                            pay.breeeve.com/
                          </span>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) =>
                              setFormData({ ...formData, slug: e.target.value })
                            }
                            className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
                            placeholder="your-link-name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description (Optional)
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 transition-all shadow-sm"
                          placeholder="Description visible during checkout"
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
                                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm"
                                  placeholder="0.00"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
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
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm"
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
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm"
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
                              Product Images (Optional, max 3)
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-purple-deep/30 transition-colors cursor-pointer">
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
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Download Link
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
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm"
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
                            {`pay.breeeve.com/${formData.slug || "your-link-name"}`}
                          </span>
                          <button 
                            type="button"
                            className="ml-auto text-xs text-gray-500 hover:text-gray-700 bg-white px-2 py-1 rounded-md border border-gray-200"
                          >
                            Copy
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
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm"
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

                  <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        step === 1
                          ? "invisible"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type={step === 4 ? "submit" : "button"}
                      onClick={() => step < 4 && setStep(step + 1)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-deep to-purple-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md"
                    >
                      {step === 4 ? "Create Link" : "Next"}
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