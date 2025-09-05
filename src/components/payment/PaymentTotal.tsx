export default function PaymentTotal({ price }: { price: number }) {
  return (
    <div className="bg-[#C9D2FF] rounded-xl p-4 shadow flex justify-between items-center">
      <p className="font-semibold ">Total Amount</p>
      <p className="text-lg font-bold">$ {price}</p>
    </div>
  );
}
