# Contributing to Vayu Vaidya • Wallmiki

Thank you for your interest in contributing to **Vayu Vaidya • Wallmiki E-Psychiatrist**! We welcome contributions from developers, neuroscientists, clinicians, art therapists, and mental health advocates.

---

## Code of Conduct & Compassionate Intent

This project is built to foster non-punitive, compassionate mental wellness support for individuals navigating distress and altered cognitive states. All contributors are expected to uphold respectful, compassionate, and trauma-informed communication.

---

## Development Workflow

1. **Fork the Repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/wallmiki-e-psychiatrist.git
   cd wallmiki-e-psychiatrist
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Run Linting & Verification**:
   ```bash
   npm run lint
   npm run build
   ```
6. **Commit with Descriptive Messages**:
   Follow conventional commits format:
   * `feat: add new sacred mandala projection to bot media library`
   * `fix: adjust web audio oscillator release envelope`
   * `docs: update clinical references in schizoOS documentation`
7. **Submit a Pull Request**:
   Provide a concise overview of the problem solved, testing performed, and any clinical or UI considerations.

---

## Ethical & Safety Guidelines

* **Harm Reduction & Medication Safety**: Any pull request modifying medication replacement scoring or psychiatric advice must adhere to conservative medical harm-reduction principles. Code must **never** recommend abrupt or unsupervised medication cessation.
* **No Hardcoded Secrets**: Ensure no API keys, tokens, or personal identifiers are committed to the repository.
