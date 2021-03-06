import React, { useState } from "react";
import { TimeSplit } from "./typings/global";
import { tick  } from "./utils/time";
import { useCssHandles } from "vtex.css-handles";
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './graphql/productReleaseDate.graphql'




const CSS_HANDLES = ["countdown"]
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()
const Countdown: StorefrontFunctionComponent = () => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })


  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText,
    },
    ssr: false,
  })

  if (!product) {
    return (
      <div>
        <span>There is no product context.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    )
  }

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)
  return (
<div className={`${handles.container} t-heading-2 fw3 w-100 c-muted-1`}>
      <div className={`${handles.countdown} db tc`}>
     <h1>falta { `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }</h1>
    </div>
    </div>
  );
};
 
Countdown.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
     title: {
          title: 'I am a title',
          type: 'string',
          default: null,
    },
    targetDate: {
      title: "Final date",
      description: "Final date used in the countdown",
      type: "string",
      default: null,
    },
  },
};

export default Countdown;
