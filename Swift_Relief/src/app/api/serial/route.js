// import { SerialPort, ReadlineParser } from 'serialport'; // Dynamically imported

let serialPortInstance = null;
// Removed: let receivedSerialData = [];
// Removed: let parser = null;

export async function POST(req) {
  const { path, baudRate } = await req.json();

  if (!path || !baudRate) {
    return new Response(JSON.stringify({ error: 'Port path and baud rate are required' }), { status: 400 });
  }

  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 500; // 500ms delay
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const { SerialPort } = await import('serialport');
      
      if (serialPortInstance && serialPortInstance.isOpen) {
        await new Promise((resolve) => serialPortInstance.close(resolve));
      }

      serialPortInstance = new SerialPort({ path, baudRate });

      await new Promise((resolve, reject) => {
        serialPortInstance.on('open', resolve);
        serialPortInstance.on('error', reject);
      });

      console.log(`Serial port ${path} opened at ${baudRate} baud`);
      return new Response(JSON.stringify({ message: `Port ${path} opened successfully.` }), { status: 200 });
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed to open serial port ${path}:`, error.message);
      attempts++;
      if (attempts < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error(`All ${MAX_RETRIES} attempts failed to open serial port ${path}. Final error:`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }
  }
}

export async function DELETE(req) {
  try {
    if (serialPortInstance && serialPortInstance.isOpen) {
      await new Promise((resolve) => serialPortInstance.close(resolve));
      console.log("Serial port closed.");
      return new Response(JSON.stringify({ message: "Port closed successfully." }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "No serial port is currently open." }), { status: 200 });
    }
  } catch (error) {
    console.error("Error closing serial port:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  const { data } = await req.json();

  if (!data) {
    return new Response(JSON.stringify({ error: 'Data to send is required' }), { status: 400 });
  }

  try {
    if (serialPortInstance && serialPortInstance.isOpen) {
      serialPortInstance.write(data);
      console.log(`Data sent: ${data}`);
      return new Response(JSON.stringify({ message: `Data '${data}' sent successfully.` }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'No serial port is currently open.' }), { status: 400 });
    }
  } catch (error) {
    console.error(`Error sending data to serial port:`, error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    if (serialPortInstance && serialPortInstance.isOpen) {
      const { ReadlineParser } = await import('serialport');
      const parser = serialPortInstance.pipe(new ReadlineParser({ delimiter: '\n' }));
      let data = await new Promise((resolve) => {
        parser.on('data', (line) => {
          parser.removeAllListeners('data'); // Read only one line for this request
          resolve(line);
        });
      });
      return new Response(JSON.stringify({ data }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "No serial port is currently open." }), { status: 400 });
    }
  } catch (error) {
    console.error("Error reading from serial port:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
