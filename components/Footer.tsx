export default function Footer() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <b>
          <span className="mb-4">Hallakedon kennel</span>
        </b>
        <br />
        <span>Anna Tiala</span>
        <br />
        <span>Jääli, Oulu</span>
        <br />
        <a href="mailto:anruntti@gmail.com">anruntti@gmail.com</a>
        <br />
      </div>
      <div className="ml-auto mt-auto">
        <span>Nettisivujen toteutus ja design: Anna Tiala</span>
      </div>
    </div>
  );
}
