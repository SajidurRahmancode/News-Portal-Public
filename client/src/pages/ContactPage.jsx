// client/src/pages/ContactPage.jsx
const ContactPage = () => {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-6">
            Have questions or feedback? We'd love to hear from you. Fill out the form below and 
            we'll get back to you as soon as possible.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white rounded-md hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default ContactPage;