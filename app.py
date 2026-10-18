from flask import Flask, render_template, request, jsonify
import pandas as pd
from pathlib import Path
from werkzeug.utils import secure_filename

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'
DATA_DIR.mkdir(exist_ok=True)
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024
ALLOWED = {'.csv'}


def load_dataset(name):
    safe = secure_filename(name or '')
    path = DATA_DIR / safe
    if path.suffix.lower() != '.csv' or not path.exists():
        raise ValueError('Choose a CSV dataset available in the data folder.')
    return pd.read_csv(path)


def records(df):
    # Convert NaN values to JSON-friendly nulls.
    return df.astype(object).where(pd.notna(df), None).to_dict(orient='records')

@app.get('/')
def home():
    datasets = sorted(p.name for p in DATA_DIR.glob('*.csv'))
    return render_template('index.html', datasets=datasets)

@app.get('/api/dataset')
def dataset_info():
    name = request.args.get('name', 'iris.csv')
    try:
        df = load_dataset(name)
        return jsonify({'name': name, 'columns': list(df.columns), 'rows': len(df), 'preview': records(df.head(8)), 'index': [str(x) for x in df.index]})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 400

@app.post('/api/select')
def select_data():
    payload = request.get_json(silent=True) or {}
    try:
        df = load_dataset(payload.get('dataset', 'iris.csv'))
        mode = payload.get('mode', 'loc')
        cols = payload.get('columns') or list(df.columns)
        cols = [c for c in cols if c in df.columns]
        if not cols:
            raise ValueError('Select at least one valid column.')
        start = payload.get('start', '0')
        end = payload.get('end', '4')
        if mode == 'iloc':
            a, b = int(start), int(end)
            if a < 0 or b < a:
                raise ValueError('For iloc, start must be 0 or greater and end must be at least start.')
            # End is inclusive in this friendly interface, so add one to Pandas slice stop.
            result = df.iloc[a:b + 1, :].loc[:, cols]
            explanation = f'df.iloc[{a}:{b + 1}, :].loc[:, {cols!r}]  — iloc uses integer positions; the end position is exclusive in Pandas.'
        else:
            # This demo uses the default integer index, so labels are numeric strings/integers.
            a, b = int(start), int(end)
            if a < 0 or b < a:
                raise ValueError('For loc, start must be 0 or greater and end must be at least start.')
            result = df.loc[a:b, cols]
            explanation = f'df.loc[{a}:{b}, {cols!r}]  — loc uses index labels and includes the end label.'
        return jsonify({'mode': mode, 'count': len(result), 'columns': list(result.columns), 'rows': records(result), 'explanation': explanation})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 400

@app.post('/api/upload')
def upload_csv():
    file = request.files.get('file')
    if not file or not file.filename:
        return jsonify({'error': 'Choose a CSV file first.'}), 400
    name = secure_filename(file.filename)
    if Path(name).suffix.lower() not in ALLOWED:
        return jsonify({'error': 'Only .csv files are supported.'}), 400
    destination = DATA_DIR / name
    file.save(destination)
    try:
        pd.read_csv(destination, nrows=2)
    except Exception:
        destination.unlink(missing_ok=True)
        return jsonify({'error': 'That file could not be read as a CSV.'}), 400
    return jsonify({'ok': True, 'name': name})

if __name__ == '__main__':
    print('\nDataset Column Explorer is starting. Open http://127.0.0.1:5000\n')
    app.run(debug=False, host='127.0.0.1', port=5000)
