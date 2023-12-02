(module
  (import "host" "mem" (memory 1))
  (import "console" "log" (func $log (param i32) (param i32)))

  (data (i32.const 0) "\03one")
  (data (i32.const 8) "\03two")
  (data (i32.const 16) "\05three")
  (data (i32.const 24) "\04four")
  (data (i32.const 32) "\04five")
  (data (i32.const 40) "\03six")
  (data (i32.const 48) "\05seven")
  (data (i32.const 56) "\05eight")
  (data (i32.const 64) "\04nine")

  (func (export "load_first_item_in_mem") (result i32)
    (i32.load8_u (i32.const 0)))

  (func (export "load_nth_item_in_mem") (param $num i32) (result i32)
    (i32.load8_u (local.get $num)))

  (func $stringEq (param $ptr i32) (param $string i32) (result i32)
    (local $size i32)
    (local $i i32)

    (local.set $size (i32.load8_u $string))
    ;; ($log $string $size)
    (local.set $string (i32.add $string 1))
    ;; ($log $string (local.get $size))

    (block $break
      (loop $loop
        (if (i32.eq $i $size)
          (then
            (return (i32.const 1))))
        (br_if $break (i32.ne (i32.load8_u (i32.add $string $i)) (i32.load8_u (i32.add $ptr $i))))
        (local.set $i (i32.add $i 1))
        (br $loop)))
    (return (i32.const 0))
  )

    (func $stringVal (param $ptr i32) (result i32)
      (local $i i32)
      (loop $loop
        (if (i32.gt_u $i 64)
          (then
            (return (i32.const 0))))
        
        (if ($stringEq $ptr $i)
          (then
            (return (i32.add (i32.shr_u $i 3) 1)))
            
            )
        (local.set $i (i32.add $i 8))
        (br $loop))
      (return (i32.const 0))
    )

  ;; (func $stringVal (param $ptr i32) (result i32)
  ;;   (if ($stringEq $ptr (i32.const 0))
  ;;     (return (i32.const 132)))
  ;;   (if ($stringEq $ptr (i32.const 4))
  ;;     (return (i32.const 2)))
  ;;   (if ($stringEq $ptr (i32.const 8))
  ;;     (return (i32.const 3)))
  ;;   (if ($stringEq $ptr (i32.const 16))
  ;;     (return (i32.const 4)))
  ;;   (if ($stringEq $ptr (i32.const 24)) 
  ;;     (return (i32.const 5)))
  ;;   (if ($stringEq $ptr (i32.const 32))
  ;;     (return (i32.const 6)))
  ;;   (if ($stringEq $ptr (i32.const 36))
  ;;     (return (i32.const 7)))
  ;;   (if ($stringEq $ptr (i32.const 44))
  ;;     (return (i32.const 8)))
  ;;   (if ($stringEq $ptr (i32.const 52))
  ;;     (return (i32.const 9)))
  ;;   (return (i32.const 0))
  ;;   (OR ())
  ;; )

  (func (export "calc") (param $start i32) (param $end i32) (result i32)
    (local $c i32)
    (local $firstDigit i32)
    (local $lastDigit i32)
    (local $calibration i32)
    (local $result i32)
    (local $digit i32)
    (loop $loop
      (if (i32.eq $start $end)
        (return (local.get $result)))
      (local.set $c (i32.load8_u $start))
      (if (i32.eq $c (i32.const 10))
        (then
          (if (i32.eq $firstDigit 0)
            (return (local.get $result)))
          (local.set $calibration (i32.add (i32.mul $firstDigit 10) $lastDigit))
          ($log 1000 (local.get $calibration))
          (local.set $result (i32.add (local.get $result) (local.get $calibration)))
          (local.set $firstDigit 0)
          (local.set $lastDigit 0))
        (else
          (if (i32.and (i32.le_u 49 $c) (i32.le_u $c 58))
            (then
              (local.set $digit (i32.sub $c 48)))
            (else
              (local.set $digit ($stringVal $start))))
          ;; ($log $start (local.get $digit))
          (if (local.get $digit)
            (then
              (if (i32.eq $firstDigit 0)
                (then
                  (local.set $firstDigit (local.get $digit))
                  (local.set $lastDigit (local.get $digit)))
                (else
                  (local.set $lastDigit (local.get $digit))))
              )
            )
          )
        )
      (local.set $start (i32.add $start 1))
      (br $loop)
    )
    (return -1)
  )
)
