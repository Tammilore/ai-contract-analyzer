# Kontra 

Kontra is an **AI-powered contract analysis tool** that detects risky clauses, highlights negotiation opportunities, and protects you from unfair legal agreements. 

## Key Features
- **Risky Clause Detection**: Identifies clauses in contracts that may pose risks or need careful consideration.
- **Negotiation Opportunities**: Highlights areas where you can negotiate better terms.
- **Unfair Agreements Detection**: Detects unfair terms that you shouldn't agree to.

## Technologies Used
- **Next.js**: Framework for building the application.
- **Tailwind CSS**: For styling the user interface.
- **Supabase**: Backend for storing and managing data.
- [**Documind**](https://github.com/DocumindHQ/documind): For structured data extraction on uploaded contracts/legal agreements.

## Requirements
Ensure the following dependencies are installed:

### System Dependencies
Documind relies on these for handling PDF operations.

- **Ghostscript** 
- **GraphicsMagick**

### Install System Dependencies
```bash
# On macOS
brew install ghostscript graphicsmagick

# On Debian/Ubuntu
sudo apt-get update
sudo apt-get install -y ghostscript graphicsmagick
```

### Others
- **Node.js** (18 or higher)
- **Npm**
- **Supabase account** - Create a bucket named `pdfAttachments` in your Supabase account to store uploaded files.

## Getting Started

### Clone the Repo
```bash
git clone https://github.com/Tammilore/ai-contract-analyzer.git
cd ai-contract-analyzer
```

### Install Dependencies
Install the required dependencies using npm:
```bash
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory and configure the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_secret_key
```

### Running the Tool Locally
1. **Run the Development Server**:
   Start the application locally:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the tool.

## License
This project is open-source under the [MIT License](LICENSE).

## Documind
This project is built using [Documind](https://www.documind.xyz), an open-source platform for extracting structured data from documents using AI. [Check it out](https://github.com/DocumindHQ/documind).

