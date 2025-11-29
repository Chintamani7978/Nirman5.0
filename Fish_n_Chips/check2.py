import pandas as pd

df = pd.read_csv('EEG_data_set.csv')

print("=== DATASET OVERVIEW ===")
print(f"Total rows: {len(df):,}")
print(f"Total columns: {len(df.columns)}")
print(f"Column names: {df.columns.tolist()}")

# Check for subject/trial identifiers
print("\n=== LOOKING FOR GROUPING COLUMNS ===")
# Are there columns we're not seeing?
print(df.head(20))

# Check status
print("\n=== STATUS DISTRIBUTION ===")
print(df['status'].value_counts())

# Check if continuous time series
print("\n=== FIRST 10 ROWS ===")
print(df.head(10))