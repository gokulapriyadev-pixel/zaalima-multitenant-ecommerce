function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#E4E1D9] bg-white px-4 py-2.5 text-sm text-[#14201C] outline-none transition focus:border-[#B8892B] focus:ring-2 focus:ring-[#B8892B]/30"
    />
  );
}

export default SearchBar;
