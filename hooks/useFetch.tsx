//useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';

/** Call this is components like:
 *      const { data: quote, loading, error } = useFetch('https://api.quotable.io/random')
 */
function useFetch(url: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<string | boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading('loading...');
    setData(null);
    setError(null);

    const source = axios.CancelToken.source();

    axios
      .get(url, { cancelToken: source.token })
      .then((res: any) => {
        setLoading(false);
        //checking for multiple responses for more flexibility
        //with the url we send in.
        // TODO This is NOT generalizable, and would need to be tailored to the return data struture for the specific endpoint

        // res.data.content && setData(res.data.content);
        // res.content && setData(res.content);
        // res.data && setData(res.data);

        // res.data is where it starts to become the reddit.json response we see in Insomnia
        setData(res.data.data.children);
      })
      .catch((err: any) => {
        setLoading(false);
        setError('An error occurred. Awkward..');
      });

    return () => {
      source.cancel();
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
