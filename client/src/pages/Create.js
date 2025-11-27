import { useState } from 'react';

function Create() {
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = { ...form, price: Number(form.price) };
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Product created!');
        setForm({ name: '', price: '', image: '' });
      } else {
        setMessage(data.message || 'Error creating product');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10 mb-5">Create Product</h1>
       <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="md:w-1/4 bg-gray-100 dark:bg-gray-900 p-5 rounded">
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name of the product
            </label>
            <input
              name="name"
              type="text"
              placeholder="Product Name"
              value={form.name}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Price
            </label>
            <input
              name="price"
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Image
            </label>
            <input
              name="image"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Submit
          </button>
        </form>
      </div>
      <h1 className="text-center font-semibold text-sm text-blue-600 mt-2">
        {message && <p>{message}</p>}
      </h1>
    </div>
  );
}

export default Create;

