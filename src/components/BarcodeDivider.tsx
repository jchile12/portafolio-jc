

const BarcodeDivider = () => {
  // Repeat the date string enough times to fill wide screens
  const dateString = "27/03/2001 ";
  const repeatCount = 50; 
  const content = dateString.repeat(repeatCount);

  return (
    <div className="w-full overflow-hidden py-8 relative select-none">
      <div
        className="whitespace-nowrap text-6xl md:text-8xl text-muted-foreground/40"
        style={{ fontFamily: "'Libre Barcode 39 Text', cursive" }}
      >
        {content}
      </div>
    </div>
  );
};

export default BarcodeDivider;
