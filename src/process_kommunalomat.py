import pandas as pd

# Load the Excel file into a pandas DataFrame
df = pd.read_excel('contents/2025/kommunalomat.xlsx')

# Translate questions
df.columns = df.columns.map(lambda q: q.replace('.', '').strip())
df = df.fillna('')

# translate responses
df = df.replace('Starke Zustimmung', 'Strong Approval')
df = df.replace('Zustimmung', 'Approval')
df = df.replace('Ablehnung', 'Rejection')
df = df.replace('Starke Ablehnung', 'Strong Rejection')

# Extract and format the results for each party
results = []
for party_idx in range(df.shape[0]):
    party_results = []
    for question_idx in range(8, 122, 2):
        question = df.columns[question_idx]
        score = df.iloc[party_idx, question_idx]
        reasoning = df.iloc[party_idx, question_idx+1].strip()
        party_results.append(f'{question}:\n{score} - {reasoning}\n')
    results.append(f'Party {party_idx}\n\n' + '\n'.join(party_results))

print('\n\n\n'.join(results))

# Optional: display the first few rows
print(df.head())