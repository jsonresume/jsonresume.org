import schema from '../../lib/schema';

export default function handler(req, res) {
  res.status(200).json(schema);
}
