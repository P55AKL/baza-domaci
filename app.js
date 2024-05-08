const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());



mongoose.connect('mongodb://localhost:27017/Restorani').then(() => {
  console.log('Uspješno povezan s bazom podataka');
}).catch((err) => {
  console.error('Greška prilikom povezivanja s bazom podataka', err);
});

const ponude = mongoose.model('ponude', new mongoose.Schema({
    ime: String,
    vrsta: String,
    adresa: String,
    hrana: String,
    telefon: String
  }, { collection: 'ponude' }));

  app.get('/ponude', async (req, res) => {
    try {
      const ponuda = await ponude.find();
      res.json(ponuda);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/ponude', async (req, res) => {
    try {
      const { naziv, vrsta, adresa, hrana, telefon } = req.body;
      const novaponude = new ponude({ naziv, vrsta, adresa, hrana, telefon });
      const spremljenaponude = await novaponude.save();
      res.status(201).json(spremljenaponude);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  app.put('/ponude/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { ime, vrsta, adresa, hrana, telefon  } = req.body;
      const ažuriranaponude = await ponude.findByIdAndUpdate(id, { ime, vrsta, adresa, hrana, telefon }, { new: true });
      res.json(ažuriranaponude);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/ponude/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ponude.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  


  const port = 3000;
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});