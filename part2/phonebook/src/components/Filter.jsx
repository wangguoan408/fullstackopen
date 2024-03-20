const Filter = ({ filter, handleFunc }) => {
  return (
    <form>
      <div>
        filter shown with
        <input id="filter" value={filter} onChange={handleFunc} />
      </div>
    </form>
  );
};

export default Filter;
