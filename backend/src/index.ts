import express from 'express'; // ✅ ESM import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the ChainProof backend service!');
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
