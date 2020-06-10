# Statistics on hardship and transportation accessibility data
#
# last modified 6/10/20 by Aristana Scourtas

import scipy
import pandas as pd


def calc_correlation(x1, x2):
    pass

def dataframe_diff(df1, df2):
    temp_df = df1.merge(df2, indicator=True, how='outer')
    diff_df = temp_df[temp_df['_merge'] != "both"]
    return diff_df

def main():
    hardship_df = pd.read_csv("../data/Census_Data_-_Selected_socioeconomic_indicators_in_Chicago__2008___2012.csv")
    transit_df = pd.read_csv("../data/transit-score.csv")

    diff_df = dataframe_diff(hardship_df, transit_df)

    joined_df = hardship_df.merge(transit_df, on=["COMMUNITY AREA NAME"], how="inner")

    calc_correlation(hardship_df["HARDSHIP INDEX"], transit_df["TRANSIT SCORE"])

if __name__ == "__main__":
    main()