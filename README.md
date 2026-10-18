# Dataset Column Explorer — Task 18

A small, terminal-friendly Flask + Pandas web app for learning how to select dataset rows and columns with `DataFrame.loc` and `DataFrame.iloc`.

## Features
- Distinct, responsive dashboard UI
- Included Iris and Titanic-style sample CSV datasets
- Preview dataset columns and rows
- Select multiple columns and a row range
- Compare `loc` (label-based, end label included) with `iloc` (position-based, end position excluded in Pandas)
- Upload your own CSV file (5 MB max)
- No Jupyter Notebook required

## Run locally (Windows PowerShell)
1. Install Python 3.10 or newer from https://www.python.org/downloads/ and enable **Add Python to PATH** during installation.
2. Extract the ZIP file.
3. Open the extracted `select-dataset-columns` folder in File Explorer.
4. Click the folder address bar, type `powershell`, and press Enter.
5. Run these commands one at a time:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

If PowerShell blocks activation, use Command Prompt instead and run:

```bat
py -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

6. Open http://127.0.0.1:5000 in your browser. Keep the terminal open while using the app. Press `Ctrl+C` in the terminal to stop it.

## Run locally (macOS / Linux terminal)
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```
Then open http://127.0.0.1:5000.

## GitHub upload (recommended: GitHub website + terminal)
1. Sign in to GitHub and open https://github.com/new.
2. Repository name: `dataset-column-explorer`.
3. Choose **Public** if you want to show this project on your profile. Do not add a README, .gitignore, or license on GitHub because this folder already contains project files.
4. Click **Create repository**. Keep the page open to copy your repository URL.
5. In the terminal, from inside the extracted project folder, run:

```bash
git init
git add .
git commit -m "Build Dataset Column Explorer with Pandas loc and iloc"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/dataset-column-explorer.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your exact GitHub username. If Git says `Author identity unknown`, run:

```bash
git config --global user.name "Your GitHub Name"
git config --global user.email "your-verified-github-email@example.com"
```

Then repeat the commit and push commands. If GitHub asks you to authenticate, finish the browser sign-in prompt. GitHub no longer accepts your account password for HTTPS Git pushes; use the browser/device flow or a personal access token if prompted.

If `origin` already exists, use `git remote -v` to check it. Correct it with `git remote set-url origin https://github.com/YOUR-USERNAME/dataset-column-explorer.git` instead of adding it again.

## Task deliverables
- Working app using Python and Pandas
- `loc` and `iloc` selection examples
- Output table showing selected records
- Iris and Titanic sample CSV datasets
- Upload support for other CSV files

## Notes
- This is a learning/demo app, not a production data hosting service.
- The built-in datasets are small sample datasets for a fast demo; upload a full dataset CSV to explore it.
