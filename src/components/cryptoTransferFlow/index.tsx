// import React, { useState } from "react";
// import { ChevronLeft, AlertCircle } from "lucide-react";
// import type {
//   AmountEntryStepProps,
//   BankSelectionStepProps,
//   HeaderProps,
//   NumberPadProps,
//   PinEntryStepProps,
//   SuccessStepProps,
// } from "../../types/types";
// import { FaceIcon, SuccessIcon } from "../../assets/svg";

// // Header Component
// const Header: React.FC<HeaderProps> = ({
//   title,
//   onBack,
//   showBackButton = true,
// }) => (
//   <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
//     {showBackButton ? (
//       <button
//         onClick={onBack}
//         className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
//         aria-label="Go back"
//       >
//         <ChevronLeft className="w-5 h-5" />
//       </button>
//     ) : (
//       <div className="w-9 h-9"></div>
//     )}
//     <h1 className="text-lg font-semibold">{title}</h1>
//     <div className="w-9 h-9"></div>
//   </div>
// );

// // Number Pad Component
// const NumberPad: React.FC<NumberPadProps> = ({
//   onNumberPress,
//   onProceed,
//   canProceed,
//   onClear,
//   showClear,
// }) => (
//   <div className="grid grid-cols-3 gap-4 w-full mx-auto absolute bottom-10 right-0 left-0">
//     {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
//       <button
//         key={num}
//         onClick={() => onNumberPress(num.toString())}
//         className="flex items-center justify-center w-12 h-12 mx-auto text-2xl font-black rounded-full transition-colors"
//       >
//         {num}
//       </button>
//     ))}

//     {/* Empty placeholder for left space */}
//     <div></div>

//     {/* Zero button (centered) */}
//     <button
//       onClick={() => onNumberPress("0")}
//       className="flex items-center justify-center w-12 h-12 mx-auto text-2xl font-black rounded-full transition-colors"
//     >
//       0
//     </button>

//     {/* Proceed button (right side) */}
//     <button
//       onClick={onProceed}
//       disabled={!canProceed}
//       className={`flex items-center justify-center mx-auto w-12 h-12 rounded-full transition-colors ${
//         canProceed
//           ? "bg-blue-600 text-white hover:bg-blue-700"
//           : "bg-gray-200 text-gray-400 cursor-not-allowed"
//       }`}
//     >
//       <FaceIcon />
//     </button>

//     {/* Clear button (below all, full width) */}
//     {showClear && (
//       <div className="col-span-3 text-center mt-4">
//         <button
//           onClick={onClear}
//           className="text-gray-600 hover:text-gray-800 transition-colors"
//         >
//           Clear
//         </button>
//       </div>
//     )}
//   </div>
// );

// // Amount Entry Component
// const AmountEntryStep: React.FC<AmountEntryStepProps> = ({
//   amount,
//   setAmount,
//   onNext,
//   onBack,
// }) => (
//   <div className="min-h-screen bg-gray-50 flex flex-col">
//     <div className="bg-white">
//       <Header title="USDC" onBack={onBack} />

//       {/* Currency Selection */}
//       <div className="p-4 flex gap-2 items-center bg-neutral-200 w-full">
//         <button className="text-sm text-gray-500">Fiat</button>
//         <button className="text-sm font-medium">Cryptocurrency</button>
//       </div>

//       {/* Amount Input */}
//       <div className="p-4">
//         <div className="mb-4">
//           <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
//             <span>Enter Amount</span>
//             <span>Available Amount: 75,000</span>
//           </div>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Enter USDC"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         <div className="text-sm text-gray-600 mb-1">
//           Minimum limit: 75,000 NGN
//         </div>
//         <div className="text-sm text-gray-600">Amount limit: 75,000 NGN</div>
//       </div>

//       {/* Warning */}
//       <div className="p-4">
//         <div className="flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//           <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//           <div className="text-sm text-yellow-800">
//             <span className="font-medium">Info</span>
//             <div className="mt-1">
//               The transfer amount of Naira with our current rate will be
//               transferred to beneficiary
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Proceed Button */}
//     <div className="mt-auto p-4 bg-white">
//       <button
//         onClick={onNext}
//         disabled={!amount}
//         className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//       >
//         Proceed
//       </button>
//     </div>
//   </div>
// );

// // Bank Selection Component
// const BankSelectionStep: React.FC<BankSelectionStepProps> = ({
//   selectedBank,
//   setSelectedBank,
//   accountNumber,
//   setAccountNumber,
//   username,
//   onNext,
//   onBack,
// }) => {
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <div className="bg-white flex-1">
//         <Header title="USDC" onBack={onBack} />

//         {/* Bank Selection */}
//         <div className="p-4">
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Bank
//             </label>
//             <select
//               value={selectedBank}
//               onChange={(e) => setSelectedBank(e.target.value)}
//               className="w-full p-4 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select Bank</option>
//               <option value="access">Access Bank</option>
//               <option value="gtb">GTBank</option>
//               <option value="zenith">Zenith Bank</option>
//               <option value="uba">UBA</option>
//             </select>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Account Number
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Account Number"
//               value={accountNumber}
//               onChange={(e) => setAccountNumber(e.target.value)}
//               className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {accountNumber && (
//             <div className="bg-blue-600 text-white p-4 rounded-lg">
//               <div className="text-center font-medium">{username}</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Proceed Button */}
//       <div className="p-4 bg-white">
//         <button
//           onClick={onNext}
//           disabled={!selectedBank || !accountNumber}
//           className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//         >
//           Proceed
//         </button>
//       </div>
//     </div>
//   );
// };

// // PIN Entry Component
// const PinEntryStep: React.FC<PinEntryStepProps> = ({
//   pin,
//   setPin,
//   onNext,
//   onBack,
// }) => {
//   const handleNumberPress = (num: string) => {
//     if (pin.length < 4) {
//       setPin((prev) => prev + num);
//     }
//   };

//   const handleProceed = () => {
//     if (pin.length === 4) {
//       onNext();
//     }
//   };

//   const handleClear = () => {
//     setPin("");
//   };

//   return (
//     <div className="min-h-screen bg-neutral-100 flex flex-col">
//       <Header title="" onBack={onBack} />

//       {/* PIN Input */}
//       <div className="flex-1 flex flex-col justify- p-4">
//         <div className="mb-12">
//           <h2 className="text-2xl font-black">Enter Transaction Pin</h2>
//           <p className="text-gray-600 text-sm">
//             Enter a 4-digit transaction code to complete transfer
//           </p>
//         </div>

//         {/* PIN Display */}
//         <div className="flex justify-center space-x-4 mb-12">
//           {[0, 1, 2, 3].map((index) => (
//             <div
//               key={index}
//               className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-lg font-semibold ${
//                 pin.length > index
//                   ? "bg-white text-black"
//                   : "border-neutral-100 bg-white"
//               }`}
//             >
//               {pin[index] ?? ""}
//             </div>
//           ))}
//         </div>

//         {/* Number Pad */}
//         <NumberPad
//           onNumberPress={handleNumberPress}
//           onProceed={handleProceed}
//           canProceed={pin.length === 4}
//           onClear={handleClear}
//           showClear={pin.length > 0}
//         />
//       </div>
//     </div>
//   );
// };

// // Success Component
// const SuccessStep: React.FC<SuccessStepProps> = ({ onDone }) => (
//   <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 max-w-[269px] mx-auto">
//     <div className="text-center flex justify-center flex-col items-center space-y-4">
//       <span>
//         <SuccessIcon className=" text-white" />
//       </span>
//       <div className="">
//         <h2 className="text-2xl font-bold text-gray-900">
//           Transfer Successful
//         </h2>
//         <p className="text-gray-600 text-sm">
//           Your transfer has been initiated and is on its way
//         </p>
//       </div>
//       <div className="pt-4">
//         <button
//           onClick={onDone}
//           className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
//         >
//           Done
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Main Component
// const CryptoTransferFlow: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [amount, setAmount] = useState("");
//   const [selectedBank, setSelectedBank] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [pin, setPin] = useState("");
//   const [username] = useState("Username");

//   const resetForm = () => {
//     setCurrentStep(1);
//     setAmount("");
//     setSelectedBank("");
//     setAccountNumber("");
//     setPin("");
//   };

//   const goToNextStep = () => {
//     setCurrentStep((prev) => prev + 1);
//   };

//   const goToPrevStep = () => {
//     setCurrentStep((prev) => Math.max(1, prev - 1));
//   };

//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <AmountEntryStep
//             amount={amount}
//             setAmount={setAmount}
//             onNext={goToNextStep}
//             onBack={goToPrevStep}
//           />
//         );
//       case 2:
//         return (
//           <BankSelectionStep
//             selectedBank={selectedBank}
//             setSelectedBank={setSelectedBank}
//             accountNumber={accountNumber}
//             setAccountNumber={setAccountNumber}
//             username={username}
//             onNext={goToNextStep}
//             onBack={goToPrevStep}
//           />
//         );
//       case 3:
//         return (
//           <PinEntryStep
//             pin={pin}
//             setPin={setPin}
//             onNext={goToNextStep}
//             onBack={goToPrevStep}
//           />
//         );
//       case 4:
//         return <SuccessStep onDone={resetForm} />;
//       default:
//         return (
//           <AmountEntryStep
//             amount={amount}
//             setAmount={setAmount}
//             onNext={goToNextStep}
//             onBack={goToPrevStep}
//           />
//         );
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-white">
//       {renderCurrentStep()}
//     </div>
//   );
// };

// export default CryptoTransferFlow;
