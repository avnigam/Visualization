import csv
import random
import numpy as np
import pandaas as pd
from scipy.cluster.vq import kmeans
from scipy.spatial.distance import cdist
import matplotlib.pyplot as plt
from sklearn import cluster as Kcluster, metrics as SK_Metrics
import matplotlib
from sklearn.preprocessing import normalize
from sklearn.decomposition import PCA
from sklearn.manifold import Isomap, MDS

data = pd.read_csv("data.csv")

K = range(1, 30)
KM = [kmeans(data, k) for k in K]
centroids = [cent for (cent, var) in KM]  # cluster centroids
D_k = [cdist(data, cent, 'correlation') for cent in centroids]
cIdx = [np.argmin(D, axis=1) for D in D_k]
dist = [np.min(D, axis=1) for D in D_k]
avgWithinSS = [sum(d) / data.shape[0] for d in dist]

np.savetxt("kmean.csv", avgWithinSS, delimiter=",")

def adaptive_sampling(df, clusters, ratio):
    k_means = Kcluster.KMeans(n_clusters=clusters, random_state=0)
    k_means.fit(df)
    df['label'] = k_means.labels_
    adaptiveSampleRows = []
    for i in range(clusters):
        adaptiveSampleRows.append(df.ix[random.sample
        (df[df['label'] == i].index, (int)(len(df[df['label'] == i]) * ratio))])

    adaptiveSample = pd.concat(adaptiveSampleRows)
    del adaptiveSample['label']

    return adaptiveSample


def random_sampling(df, ratio):
    rows = random.sample(df.index, (int)(len(df) * ratio))
    del df['label']
    return df.ix[rows]


ada_sample = adaptive_sampling(data, 3, .1)
rnd_sample = random_sampling(data, .1)

ada_sample.to_csv('adaptive_sample.csv', sep=',')
rnd_sample.to_csv('random_sample.csv', sep=',')

adaptive = ada_sample.values.tolist()
randoms = rnd_sample.values.tolist()

adaptive_A = np.array(adaptive).astype("float")
adaptive_A = normalize(adaptive_A, axis=1, norm='l1')

randoms_B = np.array(randoms).astype("float")
randoms_B = normalize(randoms_B, axis=1, norm='l1')

pca_adaptive = PCA(n_components=2)
pca_randoms = PCA(n_components=2)

transformed_data_adaptive = pca_adaptive.fit(adaptive_A).transform(adaptive_A)
transformed_data_randoms = pca_randoms.fit(randoms_B).transform(randoms_B)

transformed_data_adaptive = pd.DataFrame(transformed_data_adaptive)
transformed_data_randoms = pd.DataFrame(transformed_data_randoms)

loadings_adaptive = pca_adaptive.components_
loadings_randoms = pca_randoms.components_

root_squared_adaptive = np.sqrt(np.sum(np.square(loadings_adaptive), axis=0))
root_squared_randoms = np.sqrt(np.sum(np.square(loadings_randoms), axis=0))

print(root_squared_adaptive)
print(root_squared_randoms)

def SVD(A):
    A = np.asmatrix(A.T) * np.asmatrix(A)
    U, S, V = np.linalg.svd(A)
    eigvals = S ** 2 / np.cumsum(S)[-1]
    return eigvals

eigvals_adaptive = SVD(adaptive_A)
eigvals_randoms = SVD(randoms_B)

np.savetxt("eigvals_adaptive.csv", eigvals_adaptive, delimiter=",")
np.savetxt("eigvals_random.csv", eigvals_randoms, delimiter=",")

def find_Euclidean(df):
    dis_mat = SK_Metrics.pairwise_distances(df, metric='euclidean')
    mds = MDS(n_components=2, dissimilarity='precomputed')
    return pd.DataFrame(mds.fit_transform(dis_mat))


def find_MDS_Correlation(dataframe):
    dis_mat = SK_Metrics.pairwise_distances(dataframe, metric='correlation')
    mds = MDS(n_components=2, dissimilarity='precomputed')
    return pd.DataFrame(mds.fit_transform(dis_mat))


def createFile(random_sample, adaptive_sample, file_name):
    random_sample.columns = ["r1", "r2"]
    adaptive_sample.columns = ["r1", "r2"]
    sample = random_sample.append([adaptive_sample])
    sample.to_csv(file_name, sep=',')

MDS_Euclidean_adaptive = find_Euclidean(ada_sample)
MDS_Euclidean_randoms = find_Euclidean(rnd_sample)

MDS_Correlation_adaptive = find_MDS_Correlation(ada_sample)
MDS_Correlation_randoms = find_MDS_Correlation(rnd_sample)

createFile(MDS_Euclidean_adaptive, MDS_Euclidean_randoms, 'Euclidean.csv')
createFile(MDS_Correlation_adaptive, MDS_Correlation_randoms, 'Correlation.csv')

createFile(transformed_data_adaptive, transformed_data_randoms, 'PCA_Data.csv')