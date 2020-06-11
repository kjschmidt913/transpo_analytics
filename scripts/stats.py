# Statistics on hardship and transportation accessibility data
#
# last modified 6/10/20 by Aristana Scourtas

from scipy.stats import pearsonr
import pandas as pd


def calc_correlation(joined_df):
    # r = joined_df[["HARDSHIP INDEX", "TRANSIT SCORE"]].corr(method="pearson")
    hardship_cols = ['HARDSHIP INDEX', 'PERCENT OF HOUSING CROWDED', 'PERCENT HOUSEHOLDS BELOW POVERTY',
       'PERCENT AGED 16+ UNEMPLOYED',
       'PERCENT AGED 25+ WITHOUT HIGH SCHOOL DIPLOMA',
       'PERCENT AGED UNDER 18 OR OVER 64', 'PER CAPITA INCOME ']

    print("VARIABLES \t r \t p \n")
    for col in hardship_cols:
        clean_df = joined_df[[col, "TRANSIT SCORE"]].dropna()
        r, p = pearsonr(clean_df["TRANSIT SCORE"], clean_df[col])
        print("TRANSIT SCORE vs {} \t {} \t {}".format(col, r, p))
        # clean_df.to_csv("temp.csv")

# def calc_correlation(x1, x2):
#     r, p = pearsonr(x1, x2)
#     return (r, p)

def dataframe_diff(df1, df2):
    temp_df = df1.merge(df2, indicator=True, how='outer')
    diff_df = temp_df[temp_df['_merge'] != "both"]
    return diff_df

def main():
    hardship_df = pd.read_csv("../data/Census_Data_-_Selected_socioeconomic_indicators_in_Chicago__2008___2012.csv")
    transit_df = pd.read_csv("../data/transit-score.csv")

    # diff_df = dataframe_diff(hardship_df, transit_df)

    joined_df = hardship_df.merge(transit_df, on=["COMMUNITY AREA NAME"], how="inner")

    # r, p = calc_correlation(joined_df["TRANSIT SCORE"], joined_df["HARDSHIP INDEX"])

    calc_correlation(joined_df)

if __name__ == "__main__":
    main()