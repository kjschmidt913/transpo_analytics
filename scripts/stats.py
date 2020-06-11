# Statistics on hardship and transportation accessibility data
#
# last modified 6/11/20 by Aristana Scourtas

from scipy.stats import pearsonr
import pandas as pd
from statsmodels.stats.diagnostic import het_white
import statsmodels.api as sm
from statsmodels.formula.api import ols


def assess_heteroskedasticity(df, col):
    """ Assess heteroskedasticity between selected column and Transit Score using the White test """

    f = '{}~TRANSIT_SCORE'.format(col)  # R-like formula for statsmodels
    model = ols(formula=f, data=df).fit()
    white_test = het_white(model.resid, model.model.exog)
    labels = ['LM Statistic', 'LM - Test p - value', 'F - Statistic', 'F - Test p - value']
    print(dict(zip(labels, white_test)))
    print("\n")

def calc_correlation(joined_df):
    """ Calculate the Pearson's r correlation between SES factors and Transit Score """

    # remove spaces in col names so we can use them in R-like formulae
    cols_rename = {'HARDSHIP INDEX': 'HARDSHIP_INDEX', 'PERCENT OF HOUSING CROWDED': 'PERCENT_OF_HOUSING_CROWDED',
        'PERCENT HOUSEHOLDS BELOW POVERTY': 'PERCENT_HOUSEHOLDS_BELOW_POVERTY',
        'PERCENT AGED 16+ UNEMPLOYED': 'PERCENT_AGED_16p_UNEMPLOYED',
        'PERCENT AGED 25+ WITHOUT HIGH SCHOOL DIPLOMA': 'PERCENT_AGED_25p_WITHOUT_HIGH_SCHOOL_DIPLOMA',
        'PERCENT AGED UNDER 18 OR OVER 64': 'PERCENT_AGED_UNDER_18_OR_OVER_64',
        'PER CAPITA INCOME ': 'PER_CAPITA_INCOME',
        'TRANSIT SCORE': 'TRANSIT_SCORE'}

    joined_df = joined_df.rename(columns=cols_rename)

    hardship_cols = ['HARDSHIP_INDEX', 'PERCENT_OF_HOUSING_CROWDED', 'PERCENT_HOUSEHOLDS_BELOW_POVERTY',
       'PERCENT_AGED_16p_UNEMPLOYED',
       'PERCENT_AGED_25p_WITHOUT_HIGH_SCHOOL_DIPLOMA',
       'PERCENT_AGED_UNDER_18_OR_OVER_64', 'PER_CAPITA_INCOME']
    print("VARIABLES \t r \t p \n")
    for col in hardship_cols:
        clean_df = joined_df[[col, "TRANSIT_SCORE"]].dropna()
        r, p = pearsonr(clean_df["TRANSIT_SCORE"], clean_df[col])
        print("TRANSIT_SCORE vs {} \t {} \t {}".format(col, r, p))
        # check for unequal variance of SES factor across Transit Score
        assess_heteroskedasticity(clean_df, col)
        # clean_df.to_csv("temp.csv")

def dataframe_diff(df1, df2):
    """ Get a dataframe with all of the different rows between two dataframes """

    temp_df = df1.merge(df2, indicator=True, how='outer')
    diff_df = temp_df[temp_df['_merge'] != "both"]
    return diff_df

def main():
    hardship_df = pd.read_csv("../data/Census_Data_-_Selected_socioeconomic_indicators_in_Chicago__2008___2012.csv")
    transit_df = pd.read_csv("../data/transit-score.csv")

    # diff_df = dataframe_diff(hardship_df, transit_df)

    # inner join on community area name (i.e. neighborhood name)
    joined_df = hardship_df.merge(transit_df, on=["COMMUNITY AREA NAME"], how="inner")

    # all results printed to console
    calc_correlation(joined_df)


if __name__ == "__main__":
    main()