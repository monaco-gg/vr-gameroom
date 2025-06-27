import { TicketIcon } from "@components/Icons/TicketIcon";

/**
 * Component displays a ticket counter.
 * @param {string} className - Component classnames.
 * @param {number} amountTickets - Quantity of user's ticket
 * @returns {JSX.Element} The rendered ticket counter component.
 */
export default function TicketsAvailable({ amountTickets, className = "" }) {

  return (
    <div
      className={`flex items-center ${className}`}
    >
      <TicketIcon size={24} layout="fixed" />
      <div className="bg-[#301C3B] h-[20px] ml-[-10px] pl-[15px] px-2 self-center content-center font-semibold text-sm rounded-lg">
        <span className="text-[#D19DFF]">{amountTickets}</span>
      </div>
    </div>
  );
}
