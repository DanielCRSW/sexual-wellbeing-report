export default async function handler(req, res) {
  try {
    const fields = req.body.data.fields;

    // Log ALL field keys + labels
    const summary = fields.map(f => ({
      key: f.key,
      label: f.label
    }));

    console.log("FIELDS:", JSON.stringify(summary, null, 2));

    return res.status(200).json({ message: "Keys logged" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
}
